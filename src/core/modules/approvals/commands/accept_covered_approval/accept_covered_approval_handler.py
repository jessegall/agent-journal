from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.accept_covered_approval import AcceptCoveredApproval
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from core.modules.approvals.commands.answer_approval.answer_approval import AnswerApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.saved_approval import SavedApproval
from core.modules.drivers.support.driver_settings import AUTOMATIC_APPROVAL
from engine.setting.setting_values import SettingValues
from core.modules.settings.models.setting import Setting


class AcceptCoveredApprovalHandler(Handler[AcceptCoveredApproval, str | None]):
    """Accepts the caller's newest open request a saved yes covers, as the user who gave that yes, and
    gives what the accepted command printed; a command that fails is refused with its reason, and the request
    ends failed. With the setting Accept every approval on for the caller's environment or the project, a
    request no saved yes covers is accepted too, as the user it asks, or else the user who switched the
    setting on."""

    command = AcceptCoveredApproval

    def __init__(self, queries: Queries, bus: Bus, settings: SettingValues) -> None:
        self.queries, self.bus, self.settings = queries, bus, settings

    def handle(self, command: AcceptCoveredApproval, context: Context) -> str | None:
        open_requests = self.queries.query(ApprovalRequest).filter(requester_id=context.actor.id, state=ApprovalState.OPEN)
        request = open_requests.matching(HasValue("saved_approval_id")).newest().first()
        if request is None or request.saved_approval_id is None:
            return self.setting_acceptance(open_requests.newest().first())
        saved = self.queries.query(SavedApproval).find(request.saved_approval_id)
        outcome = self.bus.run(AnswerApproval(request.id, ApprovalDecision.ACCEPT), Actor(saved.creator_id, ActorType.USER), environment_id=request.environment_id)
        return f"saved yes {saved.id} accepted approval {request.id}\n{outcome.output}".rstrip()

    def setting_acceptance(self, request: ApprovalRequest | None) -> str | None:
        if request is None or not self.settings.flag(AUTOMATIC_APPROVAL):
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
