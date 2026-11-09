from functools import cache

from core.base.adopted_process import AdoptedProcess
from core.base.child_process import ChildProcess
from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.base.leftover_process import STOP_LIMIT_SECONDS


class ServiceProcesses:
    """The plugin services this journal runs, by plugin and service name, the digest of the plugin's files each
    was started with, and when the condition of each one that did not start was checked. The journal's server
    holds one set for its home, which a command that changes a plugin's files may start services into once the
    server has said it keeps them."""

    def __init__(self) -> None:
        self.serving = False
        self.running: dict[tuple[str, str], ChildProcess | AdoptedProcess] = {}
        self.digests: dict[tuple[str, str], str] = {}
        self.skipped: dict[tuple[str, str], Timestamp] = {}

    @classmethod
    @cache
    def shared(cls, home: JournalHome) -> "ServiceProcesses":
        return cls()

    def stop(self, key: tuple[str, str]) -> None:
        self.running.pop(key).stop_group(STOP_LIMIT_SECONDS)

    def close(self) -> None:
        for key in list(self.running):
            self.stop(key)
