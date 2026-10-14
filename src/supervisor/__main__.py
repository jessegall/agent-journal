import sys

from supervisor.launch import Launch

if __name__ == "__main__":
    sys.exit(Launch.parse(sys.argv[1:]).supervisor().run())
