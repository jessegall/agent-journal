from engine.agent_stack.frame import Frame
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.ended import Ended
from engine.agent_stack.states.paused import Paused
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.needs.ended_fact import EndedFact
from engine.agent_machine.needs.pause_fact import PauseFact
from engine.agent_machine.record.stack_move import StackMove
from engine.agent_machine.stepping.built_stack import BuiltStack
from engine.agent_machine.stepping.judged_blocks import JudgedBlocks
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.frame_end import FrameEnd
from engine.enums.lane import Lane
from engine.enums.stack_move_type import StackMoveType

# a resume and a finished compaction end no work, so their frames leave with no end that counts as progress;
# a hold ends as its condition was judged
FRAME_ENDS = {"Working": FrameEnd.CLOSED, "Waiting": FrameEnd.ANSWERED}
BLOCK_ENDS = {ConditionOutcome.SATISFIED: FrameEnd.SATISFIED, ConditionOutcome.CANCELLED: FrameEnd.CANCELLED, ConditionOutcome.TARGET_MISSING: FrameEnd.TARGET_MISSING}


class StackBuilder:
    """Builds an agent's stack from what its step read (doc 1310 section 4.3): Stopped at the bottom, one work
    frame per need in push order, one Blocked frame per open block by rank and age, then Compacting, Paused
    and Ended. A frame whose need ended leaves wherever it sits; past the depth limit the lowest-ranked
    Blocked frames get no frame and their blocks still constrain."""

    def built(self, view: AgentView) -> BuiltStack:
        old = {frame.need_key: frame for frame in view.stack.frames}
        work = self.work_lane(view)
        frames = [view.stack.frames[0], *work, *self.capped(view, len(work), self.block_lane(view, old)), *self.safety(view, old)]
        stack = Stack(frames)
        return BuiltStack(stack, tuple(self.moves(view, stack)))

    @staticmethod
    def work_lane(view: AgentView) -> list[Frame]:
        needs = {need.key: need for need in view.needs if need.state.lane is Lane.WORK and need.key not in view.suppressions}
        kept = [Frame(needs[frame.need_key].state, frame.need_key, frame.entered_at) for frame in view.stack.lane(Lane.WORK) if frame.need_key in needs]
        kept_keys = {frame.need_key for frame in kept}
        return [*kept, *(Frame(need.state, key, view.stepped_at) for key, need in needs.items() if key not in kept_keys)]

    @staticmethod
    def block_lane(view: AgentView, old: dict[NeedKey, Frame]) -> list[Frame]:
        frames = [Frame(Blocked(block), key, old[key].entered_at if key in old else view.stepped_at)
                  for block in JudgedBlocks.constraining(view) for key in [StackBuilder.block_key(block)]]
        return sorted(frames, key=lambda frame: (-view.rank_order.place(frame.state.block.reason.rank), -frame.entered_at.timestamp()))

    @staticmethod
    def block_key(block: OpenBlock) -> NeedKey:
        return NeedKey("Blocked", block.subject, block.nudge_key)

    @staticmethod
    def capped(view: AgentView, work_count: int, blocked_frames: list[Frame]) -> list[Frame]:
        room = max(view.depth_limit - work_count, 0)
        return blocked_frames[max(len(blocked_frames) - room, 0):]

    @staticmethod
    def safety(view: AgentView, old: dict[NeedKey, Frame]) -> list[Frame]:
        frames = [Frame(need.state, need.key, old[need.key].entered_at if need.key in old else view.stepped_at)
                  for need in view.needs if need.state.lane is Lane.SAFETY and need.key not in view.suppressions][:1]
        frames += [Frame(Paused(fact.causes, fact.refusal_text), NeedKey("Paused", None, "pause"), view.stepped_at) for fact in view.facts if isinstance(fact, PauseFact) and fact.causes][:1]
        frames += [Frame(Ended(fact.cause, fact.actor_id), NeedKey("Ended", None, "end"), view.stepped_at) for fact in view.facts if isinstance(fact, EndedFact)][:1]
        return frames

    @staticmethod
    def moves(view: AgentView, new: Stack) -> list[StackMove]:
        old = view.stack
        if len(old.frames) <= 1 and len(new.frames) > 1:
            return [StackMove(StackMoveType.SEEDED, None, "the stack was built from the agent's rows")]
        old_frames, new_frames = {frame.need_key: frame for frame in old.frames}, {frame.need_key: frame for frame in new.frames}
        exited = [StackMove(StackMoveType.EXITED, key, f"{type(frame.state).__name__} exited", StackBuilder.frame_end(view, frame))
                  for key, frame in old_frames.items() if key not in new_frames]
        entered = [StackMove(StackMoveType.ENTERED, key, f"{type(frame.state).__name__} entered") for key, frame in new_frames.items() if key not in old_frames]
        changed = [StackMove(StackMoveType.DATA_CHANGED, key, f"{type(frame.state).__name__} changed") for key, frame in new_frames.items()
                   if key in old_frames and old_frames[key].state != frame.state]
        return [*exited, *entered, *changed]

    @staticmethod
    def frame_end(view: AgentView, frame: Frame) -> FrameEnd | None:
        if isinstance(frame.state, Blocked):
            block_id = frame.state.block.block_id
            return BLOCK_ENDS.get(view.block_outcomes.get(block_id, ConditionOutcome.PENDING)) if block_id is not None else None
        # a frame a person removed is waived, which is no progress
        if frame.need_key in view.suppressions:
            return FrameEnd.WAIVED
        subject = frame.need_key.subject
        if subject is not None and subject in view.subject_ends:
            return view.subject_ends[subject]
        return FRAME_ENDS.get(frame.need_key.state_name)
