import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from v2.commands.cli import run  # noqa: E402

if __name__ == "__main__":
    sys.exit(run(sys.argv[1:]))
