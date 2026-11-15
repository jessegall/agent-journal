from engine.agent_stack.stacked_state import StackedState
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.ended import Ended
from engine.agent_stack.states.paused import Paused
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.states.ended_fact import EndedFact
from engine.agent_machine.states.pause_fact import PauseFact
from engine.agent_machine.record.stack_move import StackMove
from engine.agent_machine.stepping.built_stack import BuiltStack
from engine.agent_machine.stepping.judged_blocks import JudgedBlocks
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.state_end import StateEnd
from engine.enums.stack_level import StackLevel
from engine.enums.stack_move_type import StackMoveType

# a resume and a finished compaction end no work, so their frames leave with no end that counts as progress;
# a hold ends as its condition was judged
STACKED_STATE_ENDS = {"Working": StateEnd.CLOSED, "Waiting": StateEnd.ANSWERED}
BLOCK_ENDS = {ConditionOutcome.SATISFIED: StateEnd.SATISFIED, ConditionOutcome.CANCELLED: StateEnd.CANCELLED, ConditionOutcome.TARGET_MISSING: StateEnd.TARGET_MISSING}


class StackBuilder:
    """Builds an agent's stack from what its step read (doc 1310 section 4.3): Stopped at the bottom, one work
    frame per need in push order, one Blocked frame per open block by rank and age, then Compacting, Paused
    and Ended. A frame whose need ended leaves wherever it sits; past the depth limit the lowest-ranked
    Blocked frames get no frame and their blocks still constrain."""

    def built(self, view: AgentView) -> BuiltStack:
        old = {stacked_state.state_key: stacked_state for stacked_state in view.stack.stacked_states}
        work = self.work_lane(view)
        stacked_states = [view.stack.stacked_states[0], *work, *self.capped(view, len(work), self.block_lane(view, old)), *self.safety(view, old)]
        stack = Stack(stacked_states)
        return BuiltStack(stack, tuple(self.moves(view, stack)))

    @staticmethod
    def work_lane(view: AgentView) -> list[StackedState]:
        states = {required_state.key: required_state for required_state in view.states if required_state.state.lane is StackLevel.WORK and required_state.key not in view.suppressions}
        kept = [StackedState(states[stacked_state.state_key].state, stacked_state.state_key, stacked_state.entered_at) for stacked_state in view.stack.lane(StackLevel.WORK) if stacked_state.state_key in states]
        kept_keys = {stacked_state.state_key for stacked_state in kept}
        return [*kept, *(StackedState(required_state.state, key, view.stepped_at) for key, required_state in states.items() if key not in kept_keys)]

    @staticmethod
    def block_lane(view: AgentView, old: dict[StateKey, StackedState]) -> list[StackedState]:
        stacked_states = [StackedState(Blocked(block), key, old[key].entered_at if key in old else view.stepped_at)
                  for block in JudgedBlocks.constraining(view) for key in [StackBuilder.block_key(block)]]
        return sorted(stacked_states, key=lambda stacked_state: (-view.rank_order.place(stacked_state.state.block.reason.rank), -stacked_state.entered_at.timestamp()))

    @staticmethod
    def block_key(block: OpenBlock) -> StateKey:
        return StateKey("Blocked", block.subject, block.agent_message_key)

    @staticmethod
    def capped(view: AgentView, work_count: int, blocked_stacked_states: list[StackedState]) -> list[StackedState]:
        room = max(view.depth_limit - work_count, 0)
        return blocked_stacked_states[max(len(blocked_stacked_states) - room, 0):]

    @staticmethod
    def safety(view: AgentView, old: dict[StateKey, StackedState]) -> list[StackedState]:
        stacked_states = [StackedState(required_state.state, required_state.key, old[required_state.key].entered_at if required_state.key in old else view.stepped_at)
                  for required_state in view.states if required_state.state.lane is StackLevel.SAFETY and required_state.key not in view.suppressions][:1]
        stacked_states += [StackedState(Paused(fact.causes, fact.refusal_text), StateKey("Paused", None, "pause"), view.stepped_at) for fact in view.facts if isinstance(fact, PauseFact) and fact.causes][:1]
        stacked_states += [StackedState(Ended(fact.cause, fact.actor_id), StateKey("Ended", None, "end"), view.stepped_at) for fact in view.facts if isinstance(fact, EndedFact)][:1]
        return stacked_states

    @staticmethod
    def moves(view: AgentView, new: Stack) -> list[StackMove]:
        old = view.stack
        if len(old.stacked_states) <= 1 and len(new.stacked_states) > 1:
            return [StackMove(StackMoveType.SEEDED, None, "the stack was built from the agent's rows")]
        old_stacked_states, new_stacked_states = {stacked_state.state_key: stacked_state for stacked_state in old.stacked_states}, {stacked_state.state_key: stacked_state for stacked_state in new.stacked_states}
        exited = [StackMove(StackMoveType.EXITED, key, f"{type(stacked_state.state).__name__} exited", StackBuilder.stacked_state_end(view, stacked_state))
                  for key, stacked_state in old_stacked_states.items() if key not in new_stacked_states]
        entered = [StackMove(StackMoveType.ENTERED, key, f"{type(stacked_state.state).__name__} entered") for key, stacked_state in new_stacked_states.items() if key not in old_stacked_states]
        changed = [StackMove(StackMoveType.DATA_CHANGED, key, f"{type(stacked_state.state).__name__} changed") for key, stacked_state in new_stacked_states.items()
                   if key in old_stacked_states and old_stacked_states[key].state != stacked_state.state]
        return [*exited, *entered, *changed]

    @staticmethod
    def stacked_state_end(view: AgentView, stacked_state: StackedState) -> StateEnd | None:
        if isinstance(stacked_state.state, Blocked):
            block_id = stacked_state.state.block.block_id
            return BLOCK_ENDS.get(view.block_outcomes.get(block_id, ConditionOutcome.PENDING)) if block_id is not None else None
        # a frame a person removed is waived, which is no progress
        if stacked_state.state_key in view.suppressions:
            return StateEnd.WAIVED
        subject = stacked_state.state_key.subject
        if subject is not None and subject in view.subject_ends:
            return view.subject_ends[subject]
        return STACKED_STATE_ENDS.get(stacked_state.state_key.state_name)
