from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.working import Working
from engine.agent_step.frame_codec import FrameCodec
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.remove_stack_frame.remove_stack_frame import RemoveStackFrame
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_frame_suppression import AgentFrameSuppression
from core.modules.drivers.models.agent_stack import AgentStack
from engine.enums.block_end import BlockEnd

REFUSED_STATES = {"Paused": "a paused agent is resumed with journal agent resume", "Stopped": "the bottom of a stack is never removed",
                  "Ended": "an ended agent stays ended"}


class RemoveStackFrameHandler(Handler[RemoveStackFrame, str]):
    """Removes a frame as a person (doc 1310 section 4.3): a Blocked frame closes its block as waived by the
    person, a Working frame is hidden by a suppression until it is restored or assigned again, and Paused,
    Stopped and Ended are refused with the way out. Only a person pops a frame, and a pop never passes a
    policy."""

    command = RemoveStackFrame

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RemoveStackFrame, context: Context) -> str:
        if context.actor.is_agent():
            raise Refusal("only a person removes a frame from an agent's stack")
        row = self.queries.query(AgentStack).filter(session_agent_id=command.agent_id).first()
        frames = [frame for frame in (FrameCodec.decoded(row.frames) if row is not None else []) if frame.need_key.generation == command.frame]
        if not frames:
            raise Refusal(f"agent {command.agent_id} has no frame {command.frame}", f"journal driver stack {command.agent_id} lists its frames")
        state = frames[0].state
        state_name = type(state).__name__
        if state_name in REFUSED_STATES:
            raise Refusal(f"a {state_name} frame cannot be removed", REFUSED_STATES[state_name])
        if isinstance(state, Blocked) and state.block.block_id is not None:
            block = self.queries.query(AgentBlock).find(state.block.block_id)
            self.repository.save(block.changed(closed_at=context.timestamp, closed_reason=BlockEnd.WAIVED.value, closer=f"person {context.actor.id}",
                                               skip_reason=command.reason), context)
            return f"block {block.id} waived"
        if isinstance(state, Working):
            self.repository.save(AgentFrameSuppression(session_agent_id=command.agent_id, need_key=command.frame, person_id=context.actor.id,
                                                       reason=command.reason), context)
            return f"work {command.frame} hidden until it is restored or assigned again"
        raise Refusal(f"a {state_name} frame is removed by its own command", "a wait ends with journal wait end, a compaction request by its control")
