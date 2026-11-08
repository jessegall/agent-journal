from core.base.command.command_json import CommandJson
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.agent_role import AgentRole
from core.base.command.handler import Handler
from core.base.command.request_user_approval import RequestUserApproval
from core.base.database.actor_table import ActorTable
from core.base.listener.event_rows import EventRows
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.approvals.commands.answer_approval.answer_approval import AnswerApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.support.standing_approvals import StandingApprovals
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.agents.models.agent import Agent


class RequestUserApprovalHandler(Handler[RequestUserApproval, object]):
    """Keeps one open request for an agent's repeated attempt at the same action."""

    command = RequestUserApproval

    def __init__(self, queries: Queries, repository: Repository, actors: ActorTable, rows: EventRows, standing: StandingApprovals, bus: Bus) -> None:
        self.queries, self.repository = queries, repository
        self.standing, self.bus = standing, bus
        self.actors, self.rows = actors, rows

    def handle(self, command: RequestUserApproval, context: Context) -> ApprovalRequest:
        why = (command.why or command.approval.why).strip()
        if not why:
            raise Refusal("an approval needs a reason: the person is told it with the question", "add --reason \"<why this is asked>\" to the line")
        requester_id = command.requester_id if command.requester_id is not None else context.actor.id
        if not self.actors.is_agent(requester_id):
            main = MainAgentFinder.newest(self.queries)
            if main is not None:
                requester_id = main.id
        requester = self.rows.find(Agent, requester_id)
        recipient = None
        if requester is not None and requester.role != AgentRole.MAIN:
            main = MainAgentFinder.newest(self.queries)
            recipient = main.id if main is not None else requester.parent_id or requester.id
        original_suggestion = command.approval.suggestion
        if recipient is not None:
            command.approval.suggestion = f"The main agent was asked to review this request: agent {recipient}."
        command_json = CommandJson.dump(command.approval.command) if command.approval.command is not None else ""
        actions = self.queries.query(ApprovalRequest).filter(arguments=command.arguments, command_json=command_json,
                                                          required_person_id=command.approval.required_person_id,
                                                          continued_arguments=command.approval.continued_arguments)
        requests = actions.filter(requester_id=requester_id)
        if command.approval.source_version is not None:
            requests = actions
        existing = requests.matching(Among("state", (ApprovalState.OPEN, ApprovalState.RUNNING))).first()
        if existing is not None:
            if existing.relayed_by_id is not None:
                recipient = None
                command.approval.suggestion = original_suggestion
            source_version = existing.source_version if command.approval.source_version is None else command.approval.source_version
            text = existing.text if command.approval.source_version is None and existing.source_version is not None else command.approval.reason
            returns_output = existing.returns_output or command.approval.returns_output
            refused_arguments = command.approval.refused_arguments or existing.refused_arguments
            if (existing.text, existing.source_version, existing.returns_output, existing.refused_arguments, existing.recipient_agent_id) != (text, source_version, returns_output, refused_arguments, recipient):
                return self.repository.update(existing, context, text=text, source_version=source_version,
                                              returns_output=returns_output, refused_arguments=refused_arguments, recipient_agent_id=recipient)
            return existing
        if command.approval.source_version is not None:
            decided = requests.filter(source_version=command.approval.source_version).matching(
                Among("state", (ApprovalState.ACCEPTED, ApprovalState.REFUSED, ApprovalState.CLOSED))).newest().first()
            if decided is not None:
                return decided
        saved = self.repository.save(ApprovalRequest(creator_id=context.actor.id, requester_id=requester_id, text=command.approval.reason, why=why,
                                                    arguments=command.arguments, refused_arguments=command.approval.refused_arguments,
                                                    required_person_id=command.approval.required_person_id,
                                                    recipient_agent_id=recipient,
                                                    source_version=command.approval.source_version,
                                                    returns_output=command.approval.returns_output,
                                                    continued_arguments=command.approval.continued_arguments, command_json=command_json), context)
        covering = self.standing.covering(saved)
        if covering is None:
            return saved
        self.repository.update(saved, context, standing_id=covering.id)
        self.bus.run(AnswerApproval(saved.id, ApprovalDecision.ACCEPT), Actor(covering.creator_id, ActorType.USER), environment_id=saved.environment_id)
        return self.queries.query(ApprovalRequest).find(saved.id)
