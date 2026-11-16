from collections.abc import Sequence
from dataclasses import dataclass

from engine.agent_machine.stepping.grant import Grant
from engine.agent_stack.read_versions import ReadVersions
from engine.agent_stack.reason import Reason
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision import Decision
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.record.block_closing import BlockClosing
from engine.agent_machine.record.decision_inputs import DecisionInputs
from engine.agent_machine.record.event_identity import EventIdentity
from engine.agent_machine.record.intent import Intent
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.encoded_part import EncodedPart
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.agent_machine.record.rewrite import Rewrite
from engine.agent_machine.record.stack_move import StackMove
from engine.driver.stop_check import StopCheck
from engine.agent_machine.record.wake_change import WakeChange


@dataclass(frozen=True)
class DecisionRecord:
    """The one answer to an agent event: what was decided, what runs, what moved and every reason that did not
    win."""

    identity: EventIdentity
    action: Question
    decision: Decision
    shown_reason: Reason
    outranked_reasons: Sequence[Reason]
    rewrite: Rewrite
    lines: Sequence[Line]
    unconditional_effects: Sequence[Effect]
    allowed_effects: Sequence[Effect]
    after_commit: Sequence[Intent]
    terminal: str
    moves: Sequence[StackMove]
    blocks_opened: Sequence[BlockPlan]
    blocks_closed: Sequence[BlockClosing]
    waiting_lines: Sequence[Line]
    stop_checks: Sequence[StopCheck]
    counts: RefusalCounts
    wake: WakeChange
    read_versions: ReadVersions
    printing: Sequence[EncodedPart]
    inputs: DecisionInputs
    # the grants that passed a refusing policy of an admitted action, which the save spends in its own write
    spent_grants: Sequence[Grant] = ()

    def effects(self) -> list[Effect]:
        if self.decision.admits():
            return [*self.unconditional_effects, *self.allowed_effects]
        return list(self.unconditional_effects)
