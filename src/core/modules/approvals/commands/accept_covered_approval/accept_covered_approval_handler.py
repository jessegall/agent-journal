from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.command.accept_covered_approval import AcceptCoveredApproval
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.has_value import HasValue
from core.base.query.queries import Queries
from core.modules.approvals.commands.answer_approval.answer_approval import AnswerApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.standing_approval import StandingApproval
from core.modules.drivers.support.driver_settings import AUTOMATIC_APPROVAL
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.models.setting import Setting


class AcceptCoveredApprovalHandler(Handler[AcceptCoveredApproval, str | None]):
    """Accepts the caller's newest open request a standing yes covers, as the person who gave that yes, and
    gives what the accepted command printed; a command that fails is refused with its reason, and the
    request waits in the dock. With the setting Accept every approval on, a request no standing yes covers is
    accepted too, as the person it asks, or else the person who switched the setting on."""

    command = AcceptCoveredApproval

    def __init__(self, queries: Queries, bus: Bus, settings: SettingValues) -> None:
        self.queries, self.bus, self.settings = queries, bus, settings

    def handle(self, command: AcceptCoveredApproval, context: Context) -> str | None:
        open_requests = self.queries.query(ApprovalRequest).filter(requester_id=context.actor.id, state=ApprovalState.OPEN)
        request = open_requests.matching(HasValue("standing_id")).newest().first()
        if request is None or request.standing_id is None:
            return self.setting_acceptance(open_requests.newest().first())
        standing = self.queries.query(StandingApproval).find(request.standing_id)
        outcome = self.bus.run(AnswerApproval(request.id, ApprovalDecision.ACCEPT), Actor(standing.creator_id, ActorType.USER), environment_id=request.environment_id)
        return f"standing yes {standing.id} accepted approval {request.id}\n{outcome.output}".rstrip()

    def setting_acceptance(self, request: ApprovalRequest | None) -> str | None:
        if request is None or not self.settings.project.flag(AUTOMATIC_APPROVAL):
            return None
        person_id = self.accepting_person_id(request)
        if person_id is None:
            return None
        outcome = self.bus.run(AnswerApproval(request.id, ApprovalDecision.ACCEPT), Actor(person_id, ActorType.USER), environment_id=request.environment_id)
        return f"the setting Accept every approval accepted approval {request.id}\n{outcome.output}".rstrip()

    def accepting_person_id(self, request: ApprovalRequest) -> int | None:
        if request.required_person_id is not None:
            return request.required_person_id
        setting = self.queries.query(Setting).filter(key=AUTOMATIC_APPROVAL).newest().first()
        return setting.creator_id if setting is not None else None
