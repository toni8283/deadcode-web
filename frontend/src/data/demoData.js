// src/data/demoData.js - Mock data store for DeadCode Frontend Prototype

export const INITIAL_STATS = {
  filesScanned: 184,
  symbolsIndexed: 3821,
  provable: 7,
  review: 3,
  active: 2,
};

export const MOCK_REPOSITORY_TREE = [
  {
    name: 'food-api',
    type: 'dir',
    children: [
      {
        name: 'src',
        type: 'dir',
        children: [
          { name: 'api.py', type: 'file', status: 'ACTIVE', candidateId: null },
          { name: 'services.py', type: 'file', status: 'ACTIVE', candidateId: 'DC-004' },
          { name: 'routes.py', type: 'file', status: 'ACTIVE', candidateId: null },
          {
            name: 'utils',
            type: 'dir',
            children: [
              { name: 'pricing.py', type: 'file', status: 'ACTIVE', candidateId: null },
              { name: 'legacy_price.py', type: 'file', status: 'PROVABLE', candidateId: 'DC-001' },
              { name: 'unused_helpers.py', type: 'file', status: 'PROVABLE', candidateId: 'DC-002' },
              { name: 'dynamic_loader.py', type: 'file', status: 'REVIEW', candidateId: 'DC-003' },
            ],
          },
        ],
      },
      {
        name: 'tests',
        type: 'dir',
        children: [
          { name: 'test_api.py', type: 'file', status: 'SUITE', candidateId: null },
          { name: 'test_services.py', type: 'file', status: 'SUITE', candidateId: null },
        ],
      },
      { name: 'pyproject.toml', type: 'file', status: 'CONFIG', candidateId: null },
      { name: 'README.md', type: 'file', status: 'DOC', candidateId: null },
    ],
  },
];

export const MOCK_CANDIDATES = [
  {
    id: 'DC-001',
    file: 'legacy_price.py',
    path: 'src/utils/legacy_price.py',
    symbol: 'LegacyPricingCalculator',
    type: 'class',
    loc: 82,
    status: 'PROVABLE', // PROVABLE | PROVEN | REMOVED
    lastModified: '14 months ago',
    evidence: {
      references: 0,
      imports: 0,
      testReferences: 0,
      exports: 0,
      routeRegistration: 'None',
      cliRegistration: 'None',
    },
    reason: 'No references, imports, or test invocations were found across the entire repository graph.',
    codeSnippet: `class LegacyPricingCalculator:
    """Deprecated tiered pricing formula. Replaced in v2.4."""
    def __init__(self, markup: float = 0.15):
        self.markup = markup

    def calculate_bulk(self, items: list) -> float:
        total = sum(item.base_cost for item in items)
        return total * (1.0 + self.markup)`,
    proofSteps: [
      { text: 'Creating isolated worktree', status: 'success' },
      { text: 'Removing candidate AST node & imports', status: 'success' },
      { text: 'Running test suite (183 passed)', status: 'success' },
      { text: 'Running typecheck (mypy: 0 errors)', status: 'success' },
      { text: 'Running build verification', status: 'success' },
      { text: 'Re-scanning AST reference graph', status: 'success' },
    ],
    proofSummary: '183/183 tests passed. 0 broken symbols.',
  },
  {
    id: 'DC-002',
    file: 'unused_helpers.py',
    path: 'src/utils/unused_helpers.py',
    symbol: 'format_legacy_timestamp',
    type: 'function',
    loc: 41,
    status: 'PROVABLE',
    lastModified: '8 months ago',
    evidence: {
      references: 0,
      imports: 0,
      testReferences: 0,
      exports: 0,
      routeRegistration: 'None',
      cliRegistration: 'None',
    },
    reason: 'Function was decoupled during datetime standardization and is never referenced.',
    codeSnippet: `def format_legacy_timestamp(epoch: int) -> str:
    """Format Unix timestamp for deprecated v1 payload format."""
    dt = datetime.datetime.fromtimestamp(epoch, tz=datetime.timezone.utc)
    return dt.strftime("%Y-%m-%d_%H:%M:%S_LEGACY")`,
    proofSteps: [
      { text: 'Creating isolated worktree', status: 'success' },
      { text: 'Removing function definition', status: 'success' },
      { text: 'Running test suite (183 passed)', status: 'success' },
      { text: 'Re-scanning AST reference graph', status: 'success' },
    ],
    proofSummary: '183/183 tests passed.',
  },
  {
    id: 'DC-003',
    file: 'dynamic_loader.py',
    path: 'src/utils/dynamic_loader.py',
    symbol: 'resolve_plugin',
    type: 'function',
    loc: 67,
    status: 'REVIEW',
    lastModified: '3 months ago',
    evidence: {
      references: 0,
      imports: 1,
      testReferences: 0,
      exports: 1,
      routeRegistration: 'Dynamic string lookup detected',
      cliRegistration: 'None',
    },
    reason: 'Possible dynamic string invocation via __import__() or getattr(). Cannot deterministically prove safety without runtime hooks.',
    codeSnippet: `def resolve_plugin(plugin_name: str):
    """Dynamically loads plugin module based on string input."""
    module = importlib.import_module(f"plugins.{plugin_name}")
    return getattr(module, "PluginHandler")()`,
    proofSteps: [],
    proofSummary: null,
  },
  {
    id: 'DC-004',
    file: 'services.py',
    path: 'src/services.py',
    symbol: 'OrderNotificationService',
    type: 'class',
    loc: 124,
    status: 'ACTIVE',
    lastModified: '2 weeks ago',
    evidence: {
      references: 14,
      imports: 4,
      testReferences: 6,
      exports: 2,
      routeRegistration: 'Registered in /api/v2/orders',
      cliRegistration: 'None',
    },
    reason: 'Active code. Referenced across 4 modules and verified in active test suites.',
    codeSnippet: `class OrderNotificationService:
    def __init__(self, client: NotificationClient):
        self.client = client

    def dispatch(self, order_id: str, status: str) -> bool:
        return self.client.send_webhook(order_id, status)`,
    proofSteps: [],
    proofSummary: null,
  },
];

export const SCAN_LOADING_STEPS = [
  'Scanning repository ast tree...',
  'Indexing 3,821 symbols across 184 files...',
  'Building deterministic reference graph...',
  'Analyzing candidate definitions and call sites...',
  'Classifying candidates into PROVABLE, REVIEW, ACTIVE...',
];
