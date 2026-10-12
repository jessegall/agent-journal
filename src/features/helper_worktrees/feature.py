from expects import Given, Refused, Kept
from framework.base import Feature
from payload import BashCall
from resources.types import AgentRow
from controllers.types import Worktrees
from features.helper_worktrees.commands import Cut
from features.helper_worktrees.details import HelperWorktreesDetails
from features.helper_worktrees.interceptors import StayInYourCheckout, TellDrift
from framework.journal import Journal

__all__ = ["Worktrees"]


class HelperWorktrees(Feature):
    details = HelperWorktreesDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("worktree", Cut(), expects=[
            Given((Worktrees, "Not A Name")) >> Refused("a worktree name is lowercase letters, digits and dashes, not 'Not A Name'"),
        ])
        journal.agent.interceptor(TellDrift(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})]) >> Kept(),
        ])
        journal.agent.interceptor(StayInYourCheckout(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})]) >> Kept(),
        ])
