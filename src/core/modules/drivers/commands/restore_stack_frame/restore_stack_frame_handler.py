from engine.agent_step.stack_codec import StackCodec
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.restore_stack_frame.restore_stack_frame import RestoreStackFrame
from core.modules.drivers.models.hidden_state import HiddenState


OPEN_SUPPRESSIONS_REASON = "the open suppressions of one agent, a handful at most"


class RestoreStackFrameHandler(Handler[RestoreStackFrame, str]):
    """Ends the open suppression of one frame of an agent; only a person restores a frame."""

    command = RestoreStackFrame

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RestoreStackFrame, context: Context) -> str:
        if context.actor.is_agent():
            raise Refusal("only a person restores a frame of an agent's stack")
        rows = self.queries.query(HiddenState).filter(session_agent_id=command.agent_id, ended_at=None).every_row(OPEN_SUPPRESSIONS_REASON)
        row = next((row for row in rows if StackCodec.decoded_key(row.need_key).generation == command.frame), None)
        if row is None:
            raise Refusal(f"agent {command.agent_id} has no removed frame {command.frame}")
        self.repository.save(row.changed(ended_at=context.timestamp), context)
        return f"frame {command.frame} shows again"
