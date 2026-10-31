import os
import sys
from pathlib import Path

if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.base.caller.caller_request import CallerRequest
from core.base.cli.line_run import LineRun
from core.base.journal_home import JournalHome

HOME_VARIABLE = "JOURNAL_HOME"


def main(argv: list[str]) -> int:
    home = JournalHome(Path(os.environ.get(HOME_VARIABLE, ".journal")))
    return LineRun(home).run(argv, CallerRequest(dict(os.environ), os.getcwd(), os.getpid()), sys.stdout)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
