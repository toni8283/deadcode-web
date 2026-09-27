# app.py
from utils import add
from service import greet

def main():
    print(greet('world'))
    print('2 + 3 =', add(2, 3))

if __name__ == '__main__':
    main()
