from functools import cache
from threading import RLock

from core.base.adopted_process import AdoptedProcess
from core.base.child_process import ChildProcess
from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.base.leftover_process import STOP_LIMIT_SECONDS
from core.modules.plugins.support.service_retries import ServiceRetries


class ServiceProcesses:
    """The plugin services this journal runs, by plugin and service name, the digest of the plugin's files each
    was started with, when the condition of each one that did not start was checked, how each one that failed
    to run is tried again, and those paused by request. The journal's server holds one set for its home, which
    a command that changes a plugin's files may start services into once the server has said it keeps them;
    the lock keeps such a command from a round on its timer."""

    def __init__(self) -> None:
        self.serving = False
        self.running: dict[tuple[str, str], ChildProcess | AdoptedProcess] = {}
        self.digests: dict[tuple[str, str], str] = {}
        self.skipped: dict[tuple[str, str], Timestamp] = {}
        self.retries = ServiceRetries()
        self.paused: set[tuple[str, str]] = set()
        self.lock = RLock()

    @classmethod
    @cache
    def shared(cls, home: JournalHome) -> "ServiceProcesses":
        return cls()

    def stop(self, key: tuple[str, str]) -> None:
        self.running.pop(key).stop_group(STOP_LIMIT_SECONDS)

    def pause(self, key: tuple[str, str]) -> None:
        self.paused.add(key)
        if key in self.running:
            self.stop(key)

    def resume(self, key: tuple[str, str]) -> None:
        self.paused.discard(key)
        self.skipped.pop(key, None)

    def is_running(self, key: tuple[str, str]) -> bool:
        return key in self.running and self.running[key].running()

    def close(self) -> None:
        for key in list(self.running):
            self.stop(key)
