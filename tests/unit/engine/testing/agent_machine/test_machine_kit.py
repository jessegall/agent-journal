from collections.abc import Sequence
from dataclasses import replace

from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.decision import Decision
from engine.agent_machine.record.question import Question
from engine.enums.decision_class import DecisionClass
from engine.enums.question_type import QuestionType
from engine.testing.agent_machine.policy_row import PolicyRow
from engine.testing.agent_machine.policy_table import PolicyTable
from engine.testing.agent_machine.question_samples import QuestionSamples
from engine.testing.agent_machine.record_compare import RecordCompare
from engine.testing.agent_machine.record_samples import RecordSamples
from engine.testing.agent_machine.view_samples import ViewSamples
from engine.testing.examples.hook_samples import HookSamples

REFUSAL = Reason("samples.no-stop", DecisionClass.REFUSE, "samples.stop", "no stop for a worker")


class WorkerStopPolicy(Policy):
    key = "samples.no-stop"
    rank = "samples.stop"

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        return [REFUSAL] if question.is_stop() and view.agent.agent_type == "worker" else []


def test_a_hook_sample_becomes_the_question_a_story_would_ask() -> None:
    assert [QuestionSamples.of(sample).question_type for sample in (HookSamples.stop(), HookSamples.prompt("hi"), HookSamples.session_start())] == [
        QuestionType.STOP, QuestionType.PROMPT, QuestionType.OBSERVATION]


def test_a_policy_table_names_each_row_the_policy_answers_otherwise() -> None:
    stop = QuestionSamples.of(HookSamples.stop())
    table = PolicyTable([PolicyRow("worker stop", stop, ViewSamples.of("worker"), ("samples.no-stop",)),
                         PolicyRow("main stop", stop, ViewSamples.of("main"), ("samples.no-stop",))])
    assert table.failures(WorkerStopPolicy()) == ["main stop: refused nothing, the table says ('samples.no-stop',)"]


def test_the_shadow_compare_names_a_different_decision_and_ignores_the_basis() -> None:
    stop = QuestionSamples.of(HookSamples.stop())
    allowed = RecordSamples.of(stop, Decision.allowed())
    refused = replace(RecordSamples.of(stop, Decision(DecisionClass.REFUSE, REFUSAL)), basis=replace(allowed.basis, attempt=2))
    assert [difference.split(":")[0] for difference in RecordCompare.differences(allowed, refused)] == ["decision", "shown_reason"]
