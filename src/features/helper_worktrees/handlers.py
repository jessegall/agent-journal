from events import Fact
from events.helper_worktrees import WorktreeBehind, WorktreeChecked
from receiving import Handler
from resources.types import Worktree
from serving import Chat, Rows


class KeepCheckedTip(Handler[WorktreeChecked]):
    def handle(self, event: WorktreeChecked, worktrees: Rows[Worktree]) -> list[Fact]:
        worktrees.checked_at(event.n, event.working_tip)
        return []


class TellDrift(Handler[WorktreeBehind]):
    def handle(self, event: WorktreeBehind, chat: Chat) -> list[Fact]:
        chat.nudge("drifted", working=event.working, commits=event.commits, path=event.path)
        return []
