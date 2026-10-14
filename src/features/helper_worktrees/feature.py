from controllers.types import Worktrees
from events.agents import ToolCallAnswered
from events.answers import Allowed, Refused as RefusedCall
from events.asking import ToolCallAsked
from events.helper_worktrees import WorktreeBehind, WorktreeChecked
from expects import Answered, Dispatches, File, Given, Nudged, Refused, Wrote, answering, nothing
from framework.base import Feature
from framework.journal import Journal
from features.helper_worktrees.answering import StayInYourCheckout
from features.helper_worktrees.commands import Cut
from features.helper_worktrees.details import HelperWorktreesDetails
from features.helper_worktrees.handlers import KeepCheckedTip, TellDrift
from features.helper_worktrees.listeners import SpotDriftedWorktree
from resources.types import AgentRow, Environment, Worktree

__all__ = ["Worktrees"]

AGENT_ROW = AgentRow(n=1, title="claude-1", data={"provider": "claude"})
HELPER = Worktree(n=1, title="rhea", data={"path": "/elsewhere/rhea", "working": "main", "base": "abc", "branch": "helper-rhea"})


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
            Given(answered(cwd="/elsewhere/rhea"), rows=[AGENT_ROW, HELPER], files=answering({".git/refs/heads/main": "def\n"})) >> Dispatches(WorktreeChecked(n=1, working_tip="def")),
        ])
        journal.events.handle(WorktreeChecked, KeepCheckedTip(), expects=[
            Given(WorktreeChecked(n=1, working_tip="abc"), rows=[AGENT_ROW, HELPER]) >> Dispatches(nothing) & Wrote(File(".journal/runtime/worktree-tips.json", '"1": "abc"')),
        ])
        journal.events.handle(WorktreeBehind, TellDrift(), expects=[
            Given(WorktreeBehind(working="main", commits="1 commit (abc1234 meanwhile)", path="/elsewhere/rhea"), rows=[AGENT_ROW])
                >> Nudged("drifted", working="main", commits="1 commit (abc1234 meanwhile)", path="/elsewhere/rhea"),
        ])
        journal.events.answer(ToolCallAsked, StayInYourCheckout(), expects=[
            Given(asked(), rows=[AGENT_ROW]) >> Answered(Allowed()),
            Given(asked(cwd="/elsewhere", subagent=True), rows=[AGENT_ROW]) >> Answered(Allowed()),
            Given(asked(cwd="/elsewhere/.claude/worktrees/rhea"), rows=[AGENT_ROW, Environment(n=1, title="t", data={"folder": "/home/proj"})])
                >> Answered(RefusedCall("Your working folder /elsewhere/.claude/worktrees/rhea is another checkout than your own, and a new start there would move you into another environment. "
                                        "Go back with cd /home/proj first; work in another checkout with git -C <folder> or a subshell, ( cd <folder> && … ).")),
        ])
