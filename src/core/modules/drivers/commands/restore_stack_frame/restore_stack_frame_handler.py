from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.restore_stack_frame.restore_stack_frame import RestoreStackFrame
from core.modules.drivers.models.agent_frame_suppression import AgentFrameSuppression


class RestoreStackFrameHandler(Handler[RestoreStackFrame, str]):
    """Ends the open suppression of one frame of an agent; only a person restores a frame."""

    command = RestoreStackFrame

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RestoreStackFrame, context: Context) -> str:
        if context.actor.is_agent():
            raise Refusal("only a person restores a frame of an agent's stack")
        row = self.queries.query(AgentFrameSuppression).filter(session_agent_id=command.agent_id, need_key=command.frame, ended_at=None).first()
        if row is None:
            raise Refusal(f"agent {command.agent_id} has no removed frame {command.frame}")
        self.repository.save(row.changed(ended_at=context.timestamp), context)
        return f"work {command.frame} shows again"
