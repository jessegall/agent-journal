from collections.abc import Sequence
from dataclasses import replace

from engine.agent_stack.reason import Reason
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.paused import Paused
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.contracts.transform import Transform
from engine.agent_machine.needs.wake_cause import WakeCause
from engine.agent_machine.decision import Decision
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_machine.record.block_closing import BlockClosing
from engine.agent_machine.record.decision_inputs import DecisionInputs
from engine.agent_machine.record.event_identity import EventIdentity
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.encoded_part import EncodedPart
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.agent_machine.record.rewrite import Rewrite
from engine.agent_machine.record.stop_check import StopCheck
from engine.agent_machine.step_result import StepResult
from engine.agent_machine.stepping.constraints import Constraints
from engine.agent_machine.stepping.judgement import Judgement
from engine.agent_machine.stepping.judged_blocks import CLOSING_OUTCOMES, JudgedBlocks
from engine.agent_machine.stepping.refusal_counting import RefusalCounting
from engine.agent_machine.stepping.stack_builder import StackBuilder
from engine.agent_machine.stepping.wake_judgement import WakeJudgement
from engine.enums.capability_part import CapabilityPart
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.decision_class import DecisionClass
from engine.enums.effect_timing import EffectTiming
from engine.enums.block_end import BlockEnd
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.responder import Responder
from engine.enums.stop_answer_type import StopAnswerType
from engine.enums.transform_slot import TransformSlot

HANDOVER_KEY = "drivers.handover"
HANDOVER_RANK = "drivers.handover"
HANDOVER_TEXT = "The job is handed over to the parent with this stop's text."
STEP_FIRING = "step-{version}"
FALLBACK_KEY = "drivers.transform-fallback"
FALLBACK_RANK = "safety.all"
FALLBACK_TEXT = "This program cannot carry the journal's rewrite of this line: run it with journal process run \"<line>\"."
BLOCK_ENDS = {ConditionOutcome.SATISFIED: BlockEnd.SATISFIED, ConditionOutcome.CANCELLED: BlockEnd.CANCELLED, ConditionOutcome.TARGET_MISSING: BlockEnd.TARGET_MISSING}
RESPONDER_NAMES = {Responder.PARENT: "Your parent", Responder.PERSON: "A person"}
SLOT_ORDER = list(TransformSlot)
MACHINE_CLOSER = "drivers.machine"


class AgentMachine:
    """Steps one agent (doc 1310 sections 4.1 and 6.1): builds its stack from needs and safety facts, judges
    the question if there is one against every constraint, transforms an admitted tool input and judges the
    final action again, takes the program's fallback where it cannot carry a part, combines every reason,
    counts refusals and builds the one decision record. It is pure: it reads only the view and runs no
    effect, query, file, launch or typing."""

    def __init__(self, policies: Sequence[Policy] = (), transforms: Sequence[Transform] = (), lines: Sequence[LineSource] = (),
                 effects: Sequence[Effect] = (), wake_causes: Sequence[WakeCause] = ()) -> None:
        self.builder = StackBuilder()
        self.constraints = Constraints(policies)
        self.transforms = sorted(transforms, key=lambda transform: SLOT_ORDER.index(transform.slot))
        self.line_sources, self.effect_sources = lines, effects
        self.counting = RefusalCounting()
        self.wakes = WakeJudgement(wake_causes)

    def step(self, view: AgentView, question: Question) -> StepResult:
        built = self.builder.built(view)
        reasons = self.constraints.reasons(question, view, built.stack)
        rewrite = self.transformed(question, view) if question.is_tool_call() and not reasons else Rewrite.unchanged()
        if rewrite.changed():
            reasons += self.constraints.reasons(rewrite.final_question(question), view, built.stack)
        rewrite, reasons = self.with_supported_rewrite(rewrite, reasons, view, question)
        judgement = Judgement.combined(reasons, view.rank_order)
        decision = self.with_handover(judgement.decision, question, view, built.stack)
        counts = self.counting.after(decision, question, view, built, reasons)
        decision = self.escalated(decision, counts, view)
        record = self.record(view, question, decision, judgement, rewrite, counts, built.stack, built.moves, reasons)
        if decision.admits() and question.is_action():
            record = replace(record, spent_grants=tuple(self.constraints.spent_grants(rewrite.final_question(question), view)))
        return StepResult(view.basis, built.stack, record, record.wake)

    def transformed(self, question: Question, view: AgentView) -> Rewrite:
        rewrite = Rewrite.unchanged()
        for transform in self.transforms:
            applied = transform.applied(rewrite.final_question(question), view)
            if applied.changed():
                rewrite = replace(applied, slots=(*rewrite.slots, *applied.slots))
        return rewrite

    @staticmethod
    def with_supported_rewrite(rewrite: Rewrite, reasons: list[Reason], view: AgentView, question: Question) -> tuple[Rewrite, list[Reason]]:
        if not rewrite.changed() or view.program.supports(CapabilityPart.REWRITE, HookEventName.PRE_TOOL_USE):
            return rewrite, reasons
        return Rewrite.unchanged(), [*reasons, Reason(FALLBACK_KEY, DecisionClass.REFUSE, FALLBACK_RANK, FALLBACK_TEXT)]

    @staticmethod
    def with_handover(decision: Decision, question: Question, view: AgentView, stack: Stack) -> Decision:
        if not question.is_stop() or not decision.admits() or stack.has(Paused) or stack.has(Compacting):
            return decision
        answer = stack.work_lane_top().state.stop_answer(view.work_stop)
        if answer.answer_type is not StopAnswerType.HANDOVER:
            return decision
        return Decision(DecisionClass.ALLOW, Reason(HANDOVER_KEY, DecisionClass.ALLOW, HANDOVER_RANK, HANDOVER_TEXT, handover=answer.work))

    @staticmethod
    def escalated(decision: Decision, counts: RefusalCounts, view: AgentView) -> Decision:
        if decision.admits() or counts.escalation is None or counts.escalation == view.escalation:
            return decision
        text = f"{decision.reason.text} {RESPONDER_NAMES[view.responder]} was asked: you may stop and wait for the answer."
        return Decision(decision.decision_class, replace(decision.reason, text=text.strip()))

    def record(self, view: AgentView, question: Question, decision: Decision, judgement: Judgement, rewrite: Rewrite, counts: RefusalCounts,
               stack: Stack, moves: tuple, reasons: list[Reason]) -> DecisionRecord:
        lines = self.lines(question, view)
        unconditional = [effect for effect in self.effects(question, view) if effect.timing is EffectTiming.UNCONDITIONAL]
        admission = [effect for effect in self.effects(question, view) if effect.timing is EffectTiming.ON_ADMISSION] if question.is_action() else []
        return DecisionRecord(
            identity=self.identity(view, question), action=question, decision=decision, shown_reason=decision.reason,
            outranked_reasons=judgement.outranked_reasons, rewrite=rewrite if decision.admits() else Rewrite.unchanged(),
            lines=[line for line in lines if line.carrier is not LineCarrier.WAITING], unconditional_effects=unconditional,
            admission_effects=admission, after_commit=(), terminal=self.terminal(lines), moves=moves, blocks_opened=JudgedBlocks.new_plans(view),
            # a refused action did not run, so what it would have done lifts no hold; the next admitted step closes them
            blocks_closed=self.closings(view) if decision.admits() or not question.is_action() else (), waiting_lines=[line for line in lines if line.carrier is LineCarrier.WAITING],
            stop_checks=self.stop_checks(question, reasons), counts=counts, wake=self.wakes.change(view, stack), basis=view.basis,
            printing=self.printing(question, view, decision, rewrite),
            inputs=DecisionInputs(view.table_digest, tuple(need.key for need in view.needs),
                                  tuple(block.block_id for block in view.blocks if block.block_id is not None), tuple(grant.grant_id for grant in view.grants)))

    @staticmethod
    def terminal(lines: list[Line]) -> str:
        return "\n".join(line.text for line in lines if line.carrier is LineCarrier.TERMINAL)

    @staticmethod
    def identity(view: AgentView, question: Question) -> EventIdentity:
        if question.event is not None:
            return EventIdentity.identified(question.event, view.session_generation, view.agent.agent_id, view.agent.environment_id, view.agent.agent_type,
                                            view.profile, view.driver_name)
        return EventIdentity(view.program_name, view.session, view.session_generation, STEP_FIRING.format(version=view.basis.stack_version),
                             view.agent.agent_id, view.agent.environment_id, view.agent.agent_type, view.profile, view.driver_name)

    def lines(self, question: Question, view: AgentView) -> list[Line]:
        event = question.event
        sources = [source for source in self.line_sources if ((event is not None and event.event in source.events) or (event is None and source.includes_steps))
                   and not (source.start_line and event is not None and event.is_resume)]
        lines = [replace(line, source_key=source.key) for source in sources for line in source.lines(question, view)]
        # a step answers no hook, so its lines wait for the agent's next event or its wake, as at an event its program cannot carry
        if event is not None and view.program.supports(CapabilityPart.LINES, event.event):
            return lines
        # what is printed to the person's terminal is no line of the agent's, so it never waits
        return [line if line.carrier is LineCarrier.TERMINAL else replace(line, carrier=LineCarrier.WAITING) for line in lines]

    def effects(self, question: Question, view: AgentView) -> list[Effect]:
        event = question.event
        return [effect for effect in self.effect_sources if ((event is not None and event.event in effect.events) or (event is None and effect.includes_steps))]

    @staticmethod
    def closings(view: AgentView) -> list[BlockClosing]:
        return [BlockClosing(block.block_id, BLOCK_ENDS[outcome], MACHINE_CLOSER, outcome) for block in view.blocks if block.block_id is not None
                for outcome in [view.block_outcomes.get(block.block_id, ConditionOutcome.PENDING)] if outcome in CLOSING_OUTCOMES]

    @staticmethod
    def stop_checks(question: Question, reasons: list[Reason]) -> list[StopCheck]:
        if not question.is_stop():
            return []
        return [StopCheck(reason.key, reason.decision_class, reason.text, True) for reason in reasons]

    @staticmethod
    def printing(question: Question, view: AgentView, decision: Decision, rewrite: Rewrite) -> list[EncodedPart]:
        event = question.event
        if event is None:
            return []
        parts = [CapabilityPart.REWRITE] if rewrite.changed() and decision.admits() else []
        if question.is_action() and not decision.admits():
            parts.append(CapabilityPart.STOP_REFUSAL if question.is_stop() else CapabilityPart.TOOL_DENIAL)
        capabilities = [capability for part in parts for capability in [view.program.capability(part, event.event)] if capability is not None]
        return [EncodedPart(capability.part, capability.proof, capability.used_fallback()) for capability in capabilities]
