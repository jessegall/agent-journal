from engine.agent_stack.states.blocked import Blocked
from engine.agent_step.stack_codec import StackCodec
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.remove_stacked_state.remove_stacked_state import RemoveStackedState
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.hidden_state import HiddenState
from core.modules.drivers.models.agent_stack import AgentStack
from engine.enums.block_end import BlockEnd

REFUSED_STATES = {"Paused": "a paused agent is resumed with journal agent resume", "Stopped": "the bottom of a stack is never removed",
                  "Ended": "an ended agent stays ended"}
# a person's pop of these stacked states hides their need until restored; a new wait or a new context generation has a key of its own
SUPPRESSED_TEXTS = {"Working": "work {stacked_state} hidden until it is restored or assigned again", "Waiting": "wait {stacked_state} cancelled by a person",
                    "Compacting": "compaction request {stacked_state} cancelled for this context generation"}


class RemoveStackedStateHandler(Handler[RemoveStackedState, str]):
    """Removes a stacked state as a person (doc 1310 section 4.3): a Blocked stacked state closes its block as
    waived by the person, a Working stacked state is hidden by a suppression until it is restored or assigned
    again, a Waiting or Compacting stacked state is cancelled for that wait or that context generation, and
    Paused, Stopped and Ended are refused with the way out. Only a person pops a stacked state, and a pop
    never passes a policy."""

    command = RemoveStackedState

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RemoveStackedState, context: Context) -> str:
        if context.actor.is_agent():
            raise Refusal("only a person removes a stacked state from an agent's stack")
        row = self.queries.query(AgentStack).filter(session_agent_id=command.agent_id).first()
        stacked_states = [stacked_state for stacked_state in (StackCodec.decoded(row.stacked_states) if row is not None else []) if stacked_state.state_key.generation == command.stacked_state]
        if not stacked_states:
            raise Refusal(f"agent {command.agent_id} has no stacked state {command.stacked_state}", f"journal driver stack {command.agent_id} lists its stacked states")
        state = stacked_states[0].state
        state_name = type(state).__name__
        if state_name in REFUSED_STATES:
            raise Refusal(f"a {state_name} stacked state cannot be removed", REFUSED_STATES[state_name])
        if isinstance(state, Blocked) and state.block.block_id is not None:
            block = self.queries.query(AgentBlock).find(state.block.block_id)
            self.repository.save(block.changed(closed_at=context.timestamp, closed_reason=BlockEnd.WAIVED.value, closer=f"person {context.actor.id}",
                                               skip_reason=command.reason), context)
            return f"block {block.id} waived"
        if state_name not in SUPPRESSED_TEXTS:
            raise Refusal(f"a {state_name} stacked state cannot be removed", "journal driver stack lists the stacked states a person may remove")
        self.repository.save(HiddenState(session_agent_id=command.agent_id, state_key=StackCodec.encoded_key(stacked_states[0].state_key), person_id=context.actor.id,
                                                   reason=command.reason), context)
        return SUPPRESSED_TEXTS[state_name].format(stacked_state=command.stacked_state)
