import os
import re
import time
import shutil
import uuid
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

app = FastAPI(title="DeadCode Web API", version="1.0.0")

# CORS middleware for development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base paths
BASE_DIR = Path(__file__).parent.parent
TEMPLATE_DIR = BASE_DIR / "demo_template"
SESSIONS_ROOT = Path(__file__).parent / "sessions"
SESSIONS_ROOT.mkdir(exist_ok=True, parents=True)

# Locate real deadcode CLI binary
VENV_DEADCODE = BASE_DIR / "venv" / "bin" / "deadcode"
TEST_VENV_DEADCODE = Path("/home/mrblair/Documents/test/.venv/bin/deadcode")

if shutil.which("deadcode"):
    DEADCODE_BIN = shutil.which("deadcode")
elif VENV_DEADCODE.exists():
    DEADCODE_BIN = str(VENV_DEADCODE)
elif TEST_VENV_DEADCODE.exists():
    DEADCODE_BIN = str(TEST_VENV_DEADCODE)
else:
    DEADCODE_BIN = "deadcode"

print(f"[DeadCode API] Using CLI binary: {DEADCODE_BIN}")

@app.on_event("startup")
def startup_event():
    print(f"[DeadCode API] Server initialized. CLI: {DEADCODE_BIN}")
    try:
        ver = subprocess.run([DEADCODE_BIN, "--version"], capture_output=True, text=True, timeout=5)
        print(f"[DeadCode API] CLI Output: {ver.stdout.strip() or ver.stderr.strip()}")
    except Exception as e:
        print(f"[DeadCode API] CLI verification note: {e}")

# GitHub URL regex: public HTTPS only
GITHUB_URL_REGEX = re.compile(
    r"^https://github\.com/([a-zA-Z0-9_\-\.]+)/([a-zA-Z0-9_\-\.]+?)(?:\.git)?/?$"
)

# Session cleanup (older than 2 hours)
def cleanup_old_sessions(max_age_seconds: int = 7200):
    now = time.time()
    for item in SESSIONS_ROOT.iterdir():
        if item.is_dir():
            try:
                if now - item.stat().st_mtime > max_age_seconds:
                    shutil.rmtree(item, ignore_errors=True)
            except Exception:
                pass


# Models
class SessionCreateResponse(BaseModel):
    session_id: str

class AnalyzeRequest(BaseModel):
    session_id: Optional[str] = None
    source: str = Field(default="prepared", description="'prepared' or 'github'")
    url: Optional[str] = Field(default=None, description="GitHub repository URL")

class ShowRequest(BaseModel):
    session_id: str
    candidate_id: str

class ProveRequest(BaseModel):
    session_id: str
    candidate_id: str

class ApplyRequest(BaseModel):
    session_id: str
    candidate_id: str


def _get_session_dir(session_id: str) -> Path:
    # Security: sanitize session_id
    if not re.match(r"^[a-zA-Z0-9_\-]+$", session_id):
        raise HTTPException(status_code=400, detail="Invalid session ID")
    path = SESSIONS_ROOT / session_id
    if not path.exists():
        raise HTTPException(status_code=404, detail="Session expired or not found")
    return path


def _read_code_snippet(file_path: Path, line_number: int, context_lines: int = 6) -> str:
    """Read a code snippet around a specific line number."""
    if not file_path.exists() or not file_path.is_file():
        return ""
    try:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
        
        start = max(0, line_number - 1 - 2)
        end = min(len(lines), line_number - 1 + context_lines)
        return "".join(lines[start:end]).rstrip()
    except Exception:
        return ""


def _count_loc(file_path: Path, line_number: int) -> int:
    """Estimate LOC for a definition starting at line_number."""
    if not file_path.exists() or not file_path.is_file():
        return 1
    try:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
        if line_number > len(lines):
            return 1
        
        # Read from line_number until block ends
        start_idx = line_number - 1
        base_indent = len(lines[start_idx]) - len(lines[start_idx].lstrip())
        count = 1
        for l in lines[start_idx + 1:]:
            stripped = l.strip()
            if not stripped:
                count += 1
                continue
            cur_indent = len(l) - len(l.lstrip())
            if cur_indent <= base_indent and not stripped.startswith("#"):
                break
            count += 1
        return max(1, count)
    except Exception:
        return 1


def _build_repository_tree(root_path: Path, candidates_by_file: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """Build nested repository tree structure."""
    ignored_names = {".git", ".deadcode", "__pycache__", ".venv", "venv", ".pytest_cache", ".ruff_cache", ".mypy_cache", ".eggs", "*.egg-info"}

    def walk_dir(current_path: Path) -> List[Dict[str, Any]]:
        entries = []
        try:
            items = sorted(current_path.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower()))
        except Exception:
            return []

        for item in items:
            if item.name in ignored_names or item.name.startswith("."):
                continue

            rel_path = str(item.relative_to(root_path))

            if item.is_dir():
                children = walk_dir(item)
                if children:
                    entries.append({
                        "name": item.name,
                        "type": "dir",
                        "children": children,
                    })
            elif item.is_file():
                file_candidates = candidates_by_file.get(rel_path, [])
                status = None
                candidate_id = None

                if file_candidates:
                    first_c = file_candidates[0]
                    candidate_id = first_c.get("id")
                    status = first_c.get("classification", "ACTIVE")
                else:
                    if item.name.startswith("test_") or "tests/" in rel_path:
                        status = "SUITE"
                    elif item.name in ("pyproject.toml", "setup.py", "requirements.txt"):
                        status = "CONFIG"
                    elif item.name.endswith(".md"):
                        status = "DOC"
                    elif item.name.endswith(".py"):
                        status = "ACTIVE"

                entries.append({
                    "name": item.name,
                    "type": "file",
                    "status": status,
                    "candidateId": candidate_id,
                })
        return entries

    return walk_dir(root_path)


def _parse_deadcode_state(session_dir: Path) -> Dict[str, Any]:
    """Parse .deadcode/state.json generated by real CLI."""
    import json
    state_file = session_dir / ".deadcode" / "state.json"
    if not state_file.exists():
        raise HTTPException(
            status_code=500, detail="DeadCode scan completed but no state file was generated."
        )

    with open(state_file, "r", encoding="utf-8") as f:
        state_data = json.load(f)

    files_scanned = state_data.get("files_scanned", 0)
    symbols_indexed = state_data.get("total_definitions", 0)
    raw_candidates = state_data.get("candidates", {})
    proven_map = state_data.get("proven", {})

    provable_count = 0
    review_count = 0
    active_count = 0

    candidates_list = []
    candidates_by_file = {}

    for cid, cand in raw_candidates.items():
        classification = cand.get("classification", "ACTIVE")
        if classification == "PROVABLE":
            provable_count += 1
        elif classification == "REVIEW":
            review_count += 1
        elif classification == "ACTIVE":
            active_count += 1

        abs_file = cand.get("file", "")
        try:
            rel_file = str(Path(abs_file).relative_to(session_dir))
        except Exception:
            rel_file = abs_file.split("/")[-1]

        is_proven = (cid in proven_map) and (proven_map[cid].get("status") == "PROVEN")
        current_status = "PROVEN" if is_proven else classification

        full_file_path = session_dir / rel_file
        line_num = cand.get("line", 1)
        loc = _count_loc(full_file_path, line_num)
        code_snippet = _read_code_snippet(full_file_path, line_num)

        ev_items = cand.get("evidence", [])
        if ev_items:
            reason = " ".join(e.get("detail", "") for e in ev_items if e.get("detail"))
        else:
            reason = "No reference details provided by scanner."

        in_all_val = cand.get("in_all")
        exports_label = "In __all__" if in_all_val else ("Yes" if cand.get("is_exported") else "None")

        candidate_obj = {
            "id": cid,
            "file": rel_file.split("/")[-1],
            "path": rel_file,
            "symbol": cand.get("name", ""),
            "qualified_name": cand.get("qualified_name", ""),
            "type": cand.get("kind", "symbol"),
            "loc": loc,
            "line": line_num,
            "status": current_status,
            "classification": classification,
            "lastModified": "tracked in git",
            "evidence": {
                "references": cand.get("ref_count", 0),
                "imports": len(cand.get("import_relationships", [])),
                "testReferences": cand.get("test_ref_count", 0),
                "exports": exports_label,
                "routeRegistration": "None",
                "cliRegistration": "None",
                "hasDecorator": "Yes" if cand.get("has_decorator") else "None",
                "isPrivate": "Yes" if cand.get("is_private") else "No",
            },
            "rawEvidence": ev_items,
            "reason": reason,
            "codeSnippet": code_snippet,
        }

        candidates_list.append(candidate_obj)
        candidates_by_file.setdefault(rel_file, []).append(candidate_obj)

    def sort_key(c):
        priority = 0 if c["status"] in ("PROVABLE", "PROVEN") else (1 if c["status"] == "REVIEW" else 2)
        return (priority, c["id"])

    candidates_list.sort(key=sort_key)

    tree = _build_repository_tree(session_dir, candidates_by_file)

    stats = {
        "filesScanned": files_scanned,
        "symbolsIndexed": symbols_indexed,
        "provable": provable_count,
        "review": review_count,
        "active": active_count,
    }

    return {
        "stats": stats,
        "tree": tree,
        "candidates": candidates_list,
        "proven_ids": [cid for cid, p in proven_map.items() if p.get("status") == "PROVEN"],
    }


# ==============================================================
# API Endpoints
# ==============================================================

@app.post("/api/session", response_model=SessionCreateResponse)
def create_session():
    """Create a new isolated demo session."""
    cleanup_old_sessions()
    session_id = uuid.uuid4().hex
    dest = SESSIONS_ROOT / session_id
    dest.mkdir(parents=True, exist_ok=True)
    return {"session_id": session_id}


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest) -> Dict[str, Any]:
    """Analyze a repository (prepared template or public GitHub URL) using real DeadCode CLI."""
    cleanup_old_sessions()

    session_id = req.session_id or uuid.uuid4().hex
    dest = SESSIONS_ROOT / session_id

    if not dest.exists():
        dest.mkdir(parents=True, exist_ok=True)

    target_name = "deadcode-demo (Python)"

    if req.source == "prepared":
        if not TEMPLATE_DIR.exists():
            raise HTTPException(status_code=500, detail="Demo template repository not found.")
        
        shutil.rmtree(dest, ignore_errors=True)
        shutil.copytree(TEMPLATE_DIR, dest)

        subprocess.run(["git", "init"], cwd=str(dest), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["git", "config", "user.name", "Demo User"], cwd=str(dest), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["git", "config", "user.email", "demo@example.com"], cwd=str(dest), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["git", "add", "."], cwd=str(dest), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["git", "commit", "-m", "init demo session"], cwd=str(dest), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    elif req.source == "github":
        if not req.url:
            raise HTTPException(status_code=400, detail="GitHub repository URL is required.")

        match = GITHUB_URL_REGEX.match(req.url.strip())
        if not match:
            raise HTTPException(
                status_code=400,
                detail="Invalid GitHub URL. Must be a public HTTPS GitHub URL (e.g., https://github.com/username/project)."
            )

        owner, repo = match.groups()
        target_name = f"{owner}/{repo} (Python)"

        shutil.rmtree(dest, ignore_errors=True)
        dest.mkdir(parents=True, exist_ok=True)

        clone_url = f"https://github.com/{owner}/{repo}.git"
        try:
            res_clone = subprocess.run(
                ["git", "clone", "--depth", "1", clone_url, str(dest)],
                capture_output=True,
                text=True,
                timeout=45,
            )
            if res_clone.returncode != 0:
                shutil.rmtree(dest, ignore_errors=True)
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to clone repository: {res_clone.stderr.strip() or 'Repository not found or private.'}"
                )
        except subprocess.TimeoutExpired:
            shutil.rmtree(dest, ignore_errors=True)
            raise HTTPException(status_code=408, detail="Repository clone timed out after 45 seconds.")

        has_python = any(dest.rglob("*.py"))
        if not has_python:
            shutil.rmtree(dest, ignore_errors=True)
            raise HTTPException(
                status_code=400,
                detail="Not a Python repository: No Python (.py) files were found in this repository."
            )

        subprocess.run(["git", "config", "user.name", "Demo User"], cwd=str(dest), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["git", "config", "user.email", "demo@example.com"], cwd=str(dest), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported source: '{req.source}'. Expected 'prepared' or 'github'.")

    # Run the REAL DeadCode CLI scanner
    try:
        res_scan = subprocess.run(
            [DEADCODE_BIN, "scan", "."],
            cwd=str(dest),
            capture_output=True,
            text=True,
            timeout=90,
        )
        if res_scan.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"DeadCode scan failed: {res_scan.stderr or res_scan.stdout}"
            )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="DeadCode analysis timed out after 90 seconds.")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error executing DeadCode CLI: {str(e)}")

    parsed = _parse_deadcode_state(dest)

    return {
        "session_id": session_id,
        "target_name": target_name,
        "source": req.source,
        "stats": parsed["stats"],
        "tree": parsed["tree"],
        "candidates": parsed["candidates"],
        "proven_ids": parsed["proven_ids"],
        "scan_output": res_scan.stdout,
    }


@app.post("/api/show")
def show(req: ShowRequest) -> Dict[str, Any]:
    """Retrieve detailed evidence and status for a candidate using real DeadCode CLI/state."""
    dest = _get_session_dir(req.session_id)

    cli_out = ""
    try:
        res = subprocess.run(
            [DEADCODE_BIN, "show", req.candidate_id],
            cwd=str(dest),
            capture_output=True,
            text=True,
            timeout=30,
        )
        cli_out = res.stdout
    except Exception:
        pass

    parsed = _parse_deadcode_state(dest)
    candidate = next((c for c in parsed["candidates"] if c["id"] == req.candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Candidate {req.candidate_id} not found.")

    return {
        "candidate": candidate,
        "cli_output": cli_out,
    }


@app.post("/api/prove")
def prove(req: ProveRequest) -> Dict[str, Any]:
    """Execute real 'deadcode prove <candidate>' in the isolated session repository."""
    dest = _get_session_dir(req.session_id)

    try:
        res = subprocess.run(
            [DEADCODE_BIN, "prove", req.candidate_id],
            cwd=str(dest),
            capture_output=True,
            text=True,
            timeout=120,
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Proof execution timed out after 120 seconds.")

    import json
    state_file = dest / ".deadcode" / "state.json"
    proven_map = {}
    if state_file.exists():
        with open(state_file, "r", encoding="utf-8") as f:
            proven_map = json.load(f).get("proven", {})

    proven_data = proven_map.get(req.candidate_id, {})
    is_proven = (proven_data.get("status") == "PROVEN") or (res.returncode == 0 and "PROVEN SAFE TO REMOVE" in res.stdout)

    steps = [
        {"text": "Creating isolated worktree", "status": "success"},
    ]

    removal = proven_data.get("removal", {})
    if removal.get("status") == "SUCCESS":
        lines_del = removal.get("lines_removed", 0)
        steps.append({"text": f"Removing candidate AST definition ({lines_del} lines removed)", "status": "success"})
    elif removal.get("status") == "FAILED":
        steps.append({"text": f"Candidate removal failed: {removal.get('reason', 'Cannot locate definition')}", "status": "failed"})

    for v in proven_data.get("verifications", []):
        v_name = v.get("name", "test")
        v_status = v.get("status", "")
        v_reason = v.get("reason", "")
        if v_status == "SUCCESS":
            steps.append({"text": f"{v_name.capitalize()} verification passed", "status": "success"})
        elif v_status == "SKIPPED":
            steps.append({"text": f"{v_name.capitalize()}: {v_reason or 'not configured'}", "status": "skipped"})
        else:
            steps.append({"text": f"{v_name.capitalize()} verification failed", "status": "failed"})

    reanalysis = proven_data.get("reanalysis", {})
    if reanalysis.get("candidate_absent"):
        steps.append({"text": "Re-scanning AST reference graph: candidate absent", "status": "success"})
    elif removal.get("status") == "SUCCESS":
        steps.append({"text": "Re-scanning AST reference graph", "status": "success" if is_proven else "failed"})

    if is_proven:
        steps.append({"text": "PROVEN SAFE TO REMOVE", "status": "success"})

    return {
        "candidate_id": req.candidate_id,
        "is_proven": is_proven,
        "status": "PROVEN" if is_proven else "FAILED",
        "stdout": res.stdout,
        "stderr": res.stderr,
        "steps": steps,
        "failure_reason": proven_data.get("failure_reason", ""),
    }


@app.post("/api/apply")
def apply(req: ApplyRequest) -> Dict[str, Any]:
    """Execute real 'deadcode apply <candidate> --yes' after proof, then perform fresh scan."""
    dest = _get_session_dir(req.session_id)

    import json
    state_file = dest / ".deadcode" / "state.json"
    if not state_file.exists():
        raise HTTPException(status_code=400, detail="No scan state found. Cannot apply removal.")

    with open(state_file, "r", encoding="utf-8") as f:
        state_data = json.load(f)

    proven_map = state_data.get("proven", {})
    if req.candidate_id not in proven_map or proven_map[req.candidate_id].get("status") != "PROVEN":
        raise HTTPException(
            status_code=400,
            detail=f"Candidate {req.candidate_id} must be proven safe to remove before applying. Run 'Prove Safety' first."
        )

    try:
        res_apply = subprocess.run(
            [DEADCODE_BIN, "apply", req.candidate_id, "--yes"],
            cwd=str(dest),
            capture_output=True,
            text=True,
            timeout=60,
        )
        if res_apply.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"deadcode apply failed: {res_apply.stderr or res_apply.stdout}"
            )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Apply operation timed out after 60 seconds.")

    try:
        subprocess.run(
            [DEADCODE_BIN, "scan", "."],
            cwd=str(dest),
            capture_output=True,
            text=True,
            timeout=90,
        )
    except Exception:
        pass

    fresh_parsed = _parse_deadcode_state(dest)

    return {
        "success": True,
        "removed_id": req.candidate_id,
        "stdout": res_apply.stdout,
        "stats": fresh_parsed["stats"],
        "tree": fresh_parsed["tree"],
        "candidates": fresh_parsed["candidates"],
        "proven_ids": fresh_parsed["proven_ids"],
    }


# ==============================================================
# SPA Static Files & Client-Side Routing Fallback
# ==============================================================

frontend_dist = BASE_DIR / "frontend" / "dist"

if (frontend_dist / "assets").is_dir():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """Serve built frontend static assets or fallback to index.html for React Router."""
    if full_path:
        target_file = frontend_dist / full_path
        if target_file.is_file():
            return FileResponse(target_file)
    
    index_file = frontend_dist / "index.html"
    if index_file.is_file():
        return FileResponse(index_file)
    
    return {"message": "DeadCode Web API running. Frontend assets not found. Run npm run build."}
