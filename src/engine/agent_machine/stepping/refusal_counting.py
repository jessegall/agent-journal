from dataclasses import replace

from engine.agent_stack.escalation import Escalation
from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.decision import Decision
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.agent_machine.record.stack_move import StackMove
from engine.enums.decision_class import DecisionClass
from engine.enums.escalation_type import EscalationType
from engine.enums.frame_end import FrameEnd
from engine.enums.question_type import QuestionType
from engine.enums.stack_move_type import StackMoveType

STOP_LIMIT_SETTING, TOOL_LIMIT_SETTING = "drivers.most-stop-refusals", "drivers.most-tool-refusals"
STOP_LIMIT, TOOL_LIMIT = 5, 25
PROGRESS_ENDS = (FrameEnd.SATISFIED, FrameEnd.CLOSED, FrameEnd.HANDED_IN, FrameEnd.DELIVERED, FrameEnd.ANSWERED)


class RefusalCounting:
    """The stops and the tool calls refused by blocks in a row after a step, and the escalation that opens or
    is joined when a count reaches its limit (doc 1310 section 4.6): progress sets both back to 0, a
    policy's refusal counts nothing, and a limit of 0 is off."""

    def after(self, decision: Decision, question: Question, view: AgentView, moves: tuple[StackMove, ...], reasons: list[Reason]) -> RefusalCounts:
        if self.is_progress(decision, question, moves):
            return RefusalCounts(0, 0, view.escalation)
        counts = view.counts
        if question.is_stop() and not decision.admits():
            counts = replace(counts, stop_refusals=counts.stop_refusals + 1)
        if question.is_tool_call() and decision.decision_class is DecisionClass.HOLD:
            counts = replace(counts, tool_refusals=counts.tool_refusals + 1)
        return replace(counts, escalation=self.escalation(counts, view, reasons))

    @staticmethod
    def is_progress(decision: Decision, question: Question, moves: tuple[StackMove, ...]) -> bool:
        if (question.is_stop() and decision.admits()) or question.question_type is QuestionType.PROMPT:
            return True
        return any(move.frame_end in PROGRESS_ENDS or StackMoveType.ENTERED is move.move_type and move.frame_key is not None and move.frame_key.state_name == "Working"
                   for move in moves)

    @staticmethod
    def escalation(counts: RefusalCounts, view: AgentView, reasons: list[Reason]) -> Escalation | None:
        limits = ((EscalationType.STOPS, counts.stop_refusals, int(view.settings.get(STOP_LIMIT_SETTING, STOP_LIMIT))),
                  (EscalationType.TOOLS, counts.tool_refusals, int(view.settings.get(TOOL_LIMIT_SETTING, TOOL_LIMIT))))
        reached = [(escalation_type, count) for escalation_type, count, limit in limits if limit and count >= limit]
        if not reached:
            return view.escalation
        escalation_type, count = reached[0]
        block_ids = tuple(block.block_id for block in view.blocks if block.block_id is not None and block.reason in reasons)
        if view.escalation is not None:
            return replace(view.escalation, block_ids=tuple(dict.fromkeys([*view.escalation.block_ids, *block_ids])), refusal_count=count)
        return Escalation(0, escalation_type, view.responder, block_ids, (), count)
