import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from journal.app import App  # noqa: E402
from journal.config import Config  # noqa: E402
from journal.console.where import Where  # noqa: E402

if __name__ == "__main__":
    outcome = App(Config.at(Path.cwd())).console().run(sys.argv[1:], Where.from_environ(os.environ))
    sys.stdout.write(outcome.out)
    sys.stderr.write(outcome.err)
    sys.exit(outcome.code)
