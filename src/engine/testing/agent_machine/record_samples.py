from engine.agent_stack.answer_basis import AnswerBasis
from engine.agent_machine.decision import Decision
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_machine.record.decision_inputs import DecisionInputs
from engine.agent_machine.record.event_identity import EventIdentity
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.agent_machine.record.rewrite import Rewrite
from engine.agent_machine.record.wake_change import WakeChange

SAMPLE_IDENTITY = EventIdentity("claude", "s-1", 1, "story-1", 4, 1, "main", "main profile", "samples.main", ())


class RecordSamples:
    """Decision records for tests of printers, saves and the shadow compare: the given decision with nothing
    else decided, moved or run; a test changes the rest with replace."""

    @staticmethod
    def record(question: Question, decision: Decision) -> DecisionRecord:
        return DecisionRecord(SAMPLE_IDENTITY, question, decision, decision.reason, (), Rewrite.unchanged(), (), (), (), (), "", (), (), (), (), (),
                              RefusalCounts(0, 0), WakeChange.unchanged(), AnswerBasis(1, 1, 1), (), DecisionInputs("", (), (), (), ()))
