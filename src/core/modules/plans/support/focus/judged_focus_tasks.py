import threading
from functools import cache

from engine.journal.journal_home import JournalHome


class JudgedFocusTasks:
    """The started plan tasks the focus rule last judged for each agent, kept in the server process, so a hook
    whose agent started nothing since that judgement costs no read of the plan focus."""

    def __init__(self) -> None:
        self.judged: dict[int, frozenset[int]] = {}
        self.lock = threading.Lock()

    # one record for each journal a process serves, shared by every hook
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "JudgedFocusTasks":
        return JudgedFocusTasks()

    def is_judged(self, agent_id: int, task_ids: frozenset[int]) -> bool:
        with self.lock:
            return self.judged.get(agent_id) == task_ids

    def mark(self, agent_id: int, task_ids: frozenset[int]) -> None:
        with self.lock:
            self.judged[agent_id] = task_ids
