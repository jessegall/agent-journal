from events import Fact
from events.git_actions import BranchNoted, BranchSwitched, GitActionDone
from features.git_actions.listeners import branch_key
from receiving import Handler
from resources.types import AgentRow
from serving import Remembered, Rows


class NoteTheBranch(Handler[BranchNoted]):
    def handle(self, event: BranchNoted, remembered: Remembered) -> list[Fact]:
        remembered.set(branch_key(event.checkout, event.agent), event.branch)
        return []


class MarkTheBranchSwitch(Handler[BranchSwitched]):
    def handle(self, event: BranchSwitched, remembered: Remembered, agents: Rows[AgentRow]) -> list[Fact]:
        remembered.set(branch_key(event.checkout, event.agent), event.branch)
        agents.card(event.agent, label=event.label, icon="branch", tone="commit")
        return []


class MarkTheGitAction(Handler[GitActionDone]):
    def handle(self, event: GitActionDone, agents: Rows[AgentRow]) -> list[Fact]:
        agents.card(event.agent, label=event.label, icon="branch", tone="commit")
        return []
