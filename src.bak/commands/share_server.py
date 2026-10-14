import sys
from pathlib import Path

import features
from controllers.sharing.controller import Shares
from controllers.sharing.server import serve
from engine import runtime
from engine.record import Record
from framework.switches import watch_change_log
from resources.base import SYSTEM


def main(argv: list[str]) -> None:
    """The share server as a process of its own: the features loaded as the server loads them, and the journal it serves for."""
    root = Path(argv[0])
    features.load(root)
    watch_change_log()
    serve(Shares(Record(root, runtime.env(root)), actor=SYSTEM), int(argv[1]), *argv[2:3])


if __name__ == "__main__":
    main(sys.argv[1:])
