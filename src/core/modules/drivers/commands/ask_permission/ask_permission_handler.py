from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.request_user_approval import RequestUserApproval
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.commands.allow_permission.allow_permission import AllowPermission
from core.modules.drivers.commands.ask_permission.ask_permission import AskPermission
from core.modules.drivers.commands.record_agent_nudge.record_agent_nudge import RecordAgentNudge
from core.modules.drivers.models.enums.permission_state import PermissionState
from core.modules.drivers.models.permission_request import PermissionRequest
from core.modules.drivers.support.driver_nudges import PERMISSION_REQUESTED
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.models.agent import Agent

SOURCE = "drivers.permission"


class AskPermissionHandler(Handler[AskPermission, PermissionRequest]):
    """Saves an agent's request for leave to do one thing and tells the main agent, or puts a card in the dock
    where the action needs a person; the same action asked again while its request is open gives that
    request."""

    command = AskPermission

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.queries, self.repository, self.bus = queries, repository, bus

    def handle(self, command: AskPermission, context: Context) -> PermissionRequest:
        open_request = self.queries.query(PermissionRequest).filter(asker_id=context.actor.id, action=command.action).matching(
            Among("state", (PermissionState.REQUESTED, PermissionState.ALLOWED))).first()
        if open_request is not None:
            return open_request
        request = self.repository.save(PermissionRequest(asker_id=context.actor.id, action=command.action, reason=command.reason, needs_person=command.needs_person), context)
        if command.needs_person:
            question = f"Allow {AgentLabel.from_agent(self.queries.query(Agent).find(context.actor.id)).text} to do this once: {command.action}?"
            self.bus.dispatch(RequestUserApproval(UserApprovalRefusal(question, command=AllowPermission(request.id), why=command.reason), (), context.actor.id), context)
            return request
        main = MainAgentFinder.newest(self.queries)
        if main is not None:
            self.bus.dispatch(RecordAgentNudge(main.id, PERMISSION_REQUESTED.nudge(agent=self.numbers.number(AGENT_MODEL_NAME, context.actor.id), request=request.id), SOURCE), context)
        return request
