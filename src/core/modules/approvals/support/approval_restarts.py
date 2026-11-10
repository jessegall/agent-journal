from engine.change.event_log import EventLog, JOURNAL_BOOTING_EVENT
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState


class ApprovalRestarts:
    """Tells a running approval request whose action a server restart cut off: it was last saved before the latest
    start of the journal."""

    def __init__(self, events: EventLog) -> None:
        self.events = events

    def interrupted(self, request: ApprovalRequest) -> bool:
        boot = self.events.latest_event(JOURNAL_BOOTING_EVENT)
        return boot is not None and request.state is ApprovalState.RUNNING and request.update_timestamp() < boot.timestamp
