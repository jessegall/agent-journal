import os
import sys
from pathlib import Path

if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from engine.caller.caller_request import CallerRequest
from engine.cli.line_run import LineRun
from engine.journal.journal_home import HOME_VARIABLE, JournalHome


def main(argv: list[str]) -> int:
    home = JournalHome(Path(os.environ.get(HOME_VARIABLE, ".journal")))
    return LineRun(home).run(argv, CallerRequest(dict(os.environ), os.getcwd(), os.getpid()), sys.stdout)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
