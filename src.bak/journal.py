import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import features  # noqa: E402
from commands.cli import run  # noqa: E402

if __name__ == "__main__":
    try:
        features.load(commands_only=True)
        sys.exit(run(sys.argv[1:]))
    except KeyboardInterrupt:
        sys.exit(130)
