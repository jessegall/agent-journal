import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from journal.app import App  # noqa: E402
from journal.config import Config  # noqa: E402

if __name__ == "__main__":
    sys.exit(App(Config.at(Path.cwd())).console().run(sys.argv[1:]))
