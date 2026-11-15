from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.record.question import Question
from engine.agent_stack.reason import Reason
from engine.command.command import Command
from engine.enums.decision_class import DecisionClass
from engine.query.queries import Queries
from suites.coding.modules.workers.commands.ask_merge.ask_merge import AskMerge
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.journal_command_allowance import JournalCommandAllowance
from suites.coding.modules.workers.types.worker import Worker

MERGE_REQUEST_ARGUMENTS = ("worker", "ask-merge")
SHORT_TEXT = "point {points} of your work is short: prove it again with journal proof make, then ask for the merge"


class ProvedDeliveryPolicy(Policy):
    """A worker delivers no work while a proof of its worktree is short (doc 1310 sections 10.5, 10.9):
    asked at the hook of journal worker ask-merge and at AskMerge's entrance, each reading the proofs as
    they stand then, so a proof sent back after the hook admitted the line is caught at the command."""

    key = "workers.proved-delivery"
    rank = "workers.policies"
    agent_types = [Worker.key]
    entrance_commands = [AskMerge]

    def __init__(self, queries: Queries, proofs: ProofQuery) -> None:
        self.queries, self.proofs = queries, proofs

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        tool = question.tool()
        if tool is None or not JournalCommandAllowance.runs_command(tool.shell, MERGE_REQUEST_ARGUMENTS):
            return []
        return self.short_points(view.agent.agent_id)

    def entrance_refusals(self, command: Command[object], agent: AgentReference) -> Sequence[Reason]:
        return self.short_points(agent.agent_id)

    def short_points(self, agent_id: int) -> list[Reason]:
        worktree = self.queries.query(Worktree).filter(session_agent_id=agent_id, state=WorktreeState.CUT).newest().first()
        short = [str(proof.point) for proof in self.proofs.worktree_rows(worktree.id) if proof.state is ProofState.SHORT] if worktree is not None else []
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, SHORT_TEXT.format(points=", ".join(short)))] if short else []
