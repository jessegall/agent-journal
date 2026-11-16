from engine.cli.row_numbers import RowNumbers
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.request_user_approval import RequestUserApproval
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.commands.allow_permission.allow_permission import AllowPermission
from core.modules.drivers.commands.ask_permission.ask_permission import AskPermission
from core.modules.drivers.commands.record_agent_agent_message.record_agent_message import RecordAgentMessage
from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType
from core.modules.drivers.models.driver_grant import DriverGrant
from core.modules.drivers.agent_messages.permission_requested_message import PermissionRequestedMessage
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_number_messages import AgentNumberMessages

SOURCE = "drivers.permission"


class AskPermissionHandler(Handler[AskPermission, DriverGrant]):
    """Saves an agent's request for leave to do one thing and tells the main agent, or puts a card in the dock
    where the action needs a user; the same action asked again while its request is open gives that
    request."""

    command = AskPermission

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.queries, self.repository, self.bus = queries, repository, bus

    def handle(self, command: AskPermission, context: Context) -> DriverGrant:
        open_request = self.queries.query(DriverGrant).filter(grant_type=GrantType.PERMISSION, asker_id=context.actor.id, policy_key=command.action).matching(
            Among("grant_state", (GrantState.OPEN, GrantState.APPROVED))).first()
        if open_request is not None:
            return open_request
        request = self.repository.save(DriverGrant(session_agent_id=context.actor.id, grant_type=GrantType.PERMISSION, policy_key=command.action,
                                                asker_id=context.actor.id, reason=command.reason, requires_approval=command.requires_person), context)
        if command.requires_person:
            question = f"Allow {AgentLabel.labelled(self.queries.query(Agent).find(context.actor.id)).text} to do this once: {command.action}?"
            self.bus.dispatch(RequestUserApproval(UserApprovalRefusal(question, command=AllowPermission(request.id), request_reason=command.reason), (), context.actor.id), context)
            return request
        main = MainAgentFinder.newest(self.queries)
        if main is not None:
            self.bus.dispatch(RecordAgentMessage(main.id, AgentNumberMessages.message(self.numbers, PermissionRequestedMessage, "agent", context.actor.id, request=request.id), SOURCE), context)
        return request
