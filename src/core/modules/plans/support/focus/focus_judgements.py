from engine.journal.journal_home import JournalHome
from core.modules.plans.support.focus.judged_focus_tasks import JudgedFocusTasks


class FocusJudgements:
    """The started plan tasks the focus lines last judged for each agent, read from the record this journal's
    process keeps."""

    def __init__(self, home: JournalHome) -> None:
        self.judged = JudgedFocusTasks.shared(home)

    def is_judged(self, agent_id: int, task_ids: frozenset[int]) -> bool:
        return self.judged.is_judged(agent_id, task_ids)

    def mark(self, agent_id: int, task_ids: frozenset[int]) -> None:
        self.judged.mark(agent_id, task_ids)
