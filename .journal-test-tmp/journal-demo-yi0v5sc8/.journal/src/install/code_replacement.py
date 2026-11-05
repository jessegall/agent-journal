from collections.abc import Callable, Sequence

from core.base.journal_home import JournalHome
from install.server_lock import ServerLock


class CodeReplacement:
    """The one rule for changing a project's journal code, written once for install and upgrade: stop the
    running server, keep server.lock, run the given steps in order (copy the code, sync, move the rows), and
    let the lock go, even when a step fails. The first command after that starts the new server."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def run(self, steps: Sequence[Callable[[], None]]) -> None:
        with ServerLock(self.home):
            for step in steps:
                step()
