from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_ask_section import MergeAskSection

UNREAD_LINES_REASON = "the merger reads every line it has not read and settled"


class MergerWork:
    """What waits for the merger in the environment in scope: its unread lines, and the next worker it can merge,
    one merge-ready or one whose merge ask waits. Starting the merger and journal merger next ask the same."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, merge_ask: MergeAskSection) -> None:
        self.queries, self.worktrees, self.merge_ask = queries, worktrees, merge_ask

    def unread_lines(self) -> tuple[MergerLine, ...]:
        return tuple(self.queries.query(MergerLine).matching(IsNull("read_at")).matching(IsNull("outcome")).every_row(UNREAD_LINES_REASON))

    def next_worktree(self) -> Worktree | None:
        waiting_ids = self.merge_ask.waiting_worktree_ids()
        return next((row for row in self.worktrees.open_worktrees() if row.is_merge_ready or row.id in waiting_ids), None)

    def waits(self) -> bool:
        return bool(self.unread_lines()) or self.next_worktree() is not None
