from engine.agent_step.frame_codec import FrameCodec
from engine.command.context import Context
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.assignments.models.assignment import Assignment
from core.modules.drivers.models.agent_frame_suppression import OPEN_SUPPRESSIONS_REASON, AgentFrameSuppression

WORK_KEY_SEPARATOR = ":"


class AssignedWorkSuppressionListener(SaveListener[Created[Assignment]]):
    """Work assigned again to an agent shows again: the person's suppression of that work's frame ends in the
    assignment's write (doc 1310 section 4.3)."""

    name = "drivers.assigned-work-suppression"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Created[Assignment], context: Context) -> None:
        rows = self.queries.query(AgentFrameSuppression).filter(session_agent_id=event.row.actor_id, ended_at=None).every_row(OPEN_SUPPRESSIONS_REASON)
        for row in rows:
            # a work frame's generation names its work as "<model>:<row id>", as its need writes it
            model, _, row_id = FrameCodec.decoded_key(row.need_key).generation.partition(WORK_KEY_SEPARATOR)
            if model == event.row.subject_model and row_id == str(event.row.subject_id):
                self.repository.save(row.changed(ended_at=context.timestamp), context)
