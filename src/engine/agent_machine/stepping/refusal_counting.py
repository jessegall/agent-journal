from dataclasses import replace

from engine.agent_stack.escalation import Escalation
from engine.agent_stack.reason import Reason
from engine.agent_machine.record.stack_move import StackMove
from engine.agent_stack.stack import Stack
from engine.agent_machine.stepping.built_stack import BuiltStack
from engine.agent_machine.stepping.judged_blocks import JudgedBlocks
from engine.agent_stack.states.working import Working
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.decision import Decision
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.decision_class import DecisionClass
from engine.enums.escalation_type import EscalationType
from engine.enums.state_end import StateEnd
from engine.enums.question_type import QuestionType
from engine.enums.responder import Responder
from engine.enums.stack_move_type import StackMoveType

STOP_LIMIT_SETTING, TOOL_LIMIT_SETTING = "journal.core.drivers.most-stop-refusals", "journal.core.drivers.most-tool-refusals"
STOP_LIMIT, TOOL_LIMIT = 5, 25
PROGRESS_ENDS = (StateEnd.SATISFIED, StateEnd.CLOSED, StateEnd.HANDED_IN, StateEnd.DELIVERED, StateEnd.ANSWERED)


class RefusalCounting:
    """The stops and the tool calls refused by blocks in a row after a step, and the escalation that opens or
    is joined when a count reaches its limit (doc 1310 section 4.6): progress sets both back to 0, a
    policy's refusal counts nothing, and a limit of 0 is off."""

    def after(self, decision: Decision, question: Question, view: AgentView, built: BuiltStack, reasons: list[Reason]) -> RefusalCounts:
        if self.is_progress(decision, question, built.moves):
            return RefusalCounts(0, 0, view.escalation)
        counts = view.counts
        if question.is_stop() and not decision.admits():
            counts = replace(counts, stop_refusals=counts.stop_refusals + 1)
        if question.is_tool_call() and decision.decision_class is DecisionClass.HOLD:
            counts = replace(counts, tool_refusals=counts.tool_refusals + 1)
        return replace(counts, escalation=self.escalation(counts, view, built.stack, reasons))

    @staticmethod
    def is_progress(decision: Decision, question: Question, moves: tuple[StackMove, ...]) -> bool:
        if (question.is_stop() and decision.admits()) or question.question_type is QuestionType.PROMPT:
            return True
        return any(move.stacked_state_end in PROGRESS_ENDS or StackMoveType.ENTERED is move.move_type and move.stacked_state_key is not None and move.stacked_state_key.state_name == "Working"
                   for move in moves)

    @staticmethod
    def escalation(counts: RefusalCounts, view: AgentView, stack: Stack, reasons: list[Reason]) -> Escalation | None:
        limits = ((EscalationType.STOPS, counts.stop_refusals, int(view.settings.get(STOP_LIMIT_SETTING, STOP_LIMIT))),
                  (EscalationType.TOOLS, counts.tool_refusals, int(view.settings.get(TOOL_LIMIT_SETTING, TOOL_LIMIT))))
        reached = [(escalation_type, count) for escalation_type, count, limit in limits if limit and count >= limit]
        if not reached:
            return view.escalation or RefusalCounting.repair(view)
        escalation_type, count = reached[0]
        # the holds as this step judged them, with the reasons of their plans, whose tool or stop refusal refused
        block_ids = tuple(block.block_id for block in JudgedBlocks.constraining(view)
                          if block.block_id is not None and (block.reason in reasons or block.stop_refusal() in reasons))
        # the Working stacked states whose stop answer refused, which the escalation defers with the holds it names
        work_keys = tuple(stacked_state.state_key for stacked_state in stack.stacked_states if isinstance(stacked_state.state, Working) and stacked_state.state.stop_reason in reasons)
        if view.escalation is not None:
            return replace(view.escalation, block_ids=tuple(dict.fromkeys([*view.escalation.block_ids, *block_ids])),
                           work_keys=tuple(dict.fromkeys([*view.escalation.work_keys, *work_keys])), refusal_count=count)
        return Escalation(0, escalation_type, view.responder, block_ids, work_keys, count)

    # a hold no one can judge never passes, so a person is asked to repair it; the escalation defers nothing
    @staticmethod
    def repair(view: AgentView) -> Escalation | None:
        if ConditionOutcome.UNAVAILABLE not in view.block_outcomes.values():
            return None
        return Escalation(0, EscalationType.REPAIR, Responder.PERSON, (), (), 0)
