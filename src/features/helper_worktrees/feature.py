from controllers.types import Worktrees
from events.agents import ToolCallAnswered
from events.answers import Allowed
from events.asking import ToolCallAsked
from events.helper_worktrees import WorktreeBehind, WorktreeChecked
from expects import Answered, Dispatches, Given, Nudged, Refused, nothing
from framework.base import Feature
from framework.journal import Journal
from features.helper_worktrees.answering import StayInYourCheckout
from features.helper_worktrees.commands import Cut
from features.helper_worktrees.details import HelperWorktreesDetails
from features.helper_worktrees.handlers import KeepCheckedTip, TellDrift
from features.helper_worktrees.listeners import SpotDriftedWorktree
from resources.types import AgentRow, Worktree

__all__ = ["Worktrees"]

AGENT_ROW = AgentRow(n=1, title="claude-1", data={"provider": "claude"})
HELPER = Worktree(n=1, title="rhea", path="/elsewhere/rhea", working="main", base="abc", branch="helper-rhea")


def answered(command: str = "ls", cwd: str = "/project", subagent: bool = False, paths: tuple[str, ...] = ()) -> ToolCallAnswered:
    return ToolCallAnswered(agent=1, tool="Bash", input=command, cwd=cwd, subagent=subagent, paths=paths)


def asked(command: str = "ls", cwd: str = "", subagent: bool = False) -> ToolCallAsked:
    return ToolCallAsked(tool="Bash", input=command, cwd=cwd, subagent=subagent, session="claude-1")


class HelperWorktrees(Feature):
    details = HelperWorktreesDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("worktree", Cut(), expects=[
            Given((Worktrees, "Not A Name")) >> Refused("a worktree name is lowercase letters, digits and dashes, not 'Not A Name'"),
        ])
        journal.events.listen(ToolCallAnswered, SpotDriftedWorktree(), expects=[
            Given(answered(), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(answered(), rows=[AGENT_ROW, HELPER]) >> Dispatches(nothing),
            Given(answered(subagent=True), rows=[AGENT_ROW, HELPER]) >> Dispatches(nothing),
        ])
        journal.events.handle(WorktreeChecked, KeepCheckedTip(), expects=[
            Given(WorktreeChecked(n=1, working_tip="abc"), rows=[AGENT_ROW, HELPER]) >> Dispatches(nothing),
        ])
        journal.events.handle(WorktreeBehind, TellDrift(), expects=[
            Given(WorktreeBehind(working="main", commits="1 commit (abc1234 meanwhile)", path="/elsewhere/rhea"), rows=[AGENT_ROW])
                >> Nudged("drifted", working="main", commits="1 commit (abc1234 meanwhile)", path="/elsewhere/rhea"),
        ])
        journal.events.answer(ToolCallAsked, StayInYourCheckout(), expects=[
            Given(asked(), rows=[AGENT_ROW]) >> Answered(Allowed()),
            Given(asked(cwd="/elsewhere", subagent=True), rows=[AGENT_ROW]) >> Answered(Allowed()),
        ])
