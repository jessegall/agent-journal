from expects import Given, Kept
from features.base import Feature
from providers.payload import BashCall
from resources.types import AgentRow
from features.helper_worktrees.controller import Worktrees
from features.helper_worktrees.details import HelperWorktreesDetails
from features.helper_worktrees.interceptors import StayInYourCheckout, TellDrift
from features.journal import Journal

__all__ = ["Worktrees"]


class HelperWorktrees(Feature):
    details = HelperWorktreesDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(TellDrift(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})]) >> Kept(),
        ])
        journal.agent.interceptor(StayInYourCheckout(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})]) >> Kept(),
        ])
