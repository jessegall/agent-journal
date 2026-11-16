from collections.abc import Sequence

from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.record.question import Question
from engine.enums.decision_class import DecisionClass
from engine.enums.question_type import QuestionType
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.policy_row import PolicyRow
from engine.testing.agent_machine.policy_table import PolicyTable
from engine.testing.agent_machine.question_samples import QuestionSamples
from engine.testing.agent_machine.view_samples import ViewSamples
from engine.testing.examples.hook_samples import HookSamples

REFUSAL = Reason("samples.no-stop", DecisionClass.REFUSE, "samples.stop", "no stop for a worker")


class WorkerStopPolicy(Policy):
    key = "samples.no-stop"
    rank = "samples.stop"

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        return [REFUSAL] if question.is_stop() and view.agent.agent_type == "worker" else []


def test_a_hook_sample_becomes_the_question_a_story_would_ask() -> None:
    assert [QuestionSamples.question(sample).question_type for sample in (HookSamples.stop(), HookSamples.prompt("hi"), HookSamples.session_start())] == [
        QuestionType.STOP, QuestionType.PROMPT, QuestionType.OBSERVATION]


def test_a_policy_table_names_each_row_the_policy_answers_otherwise() -> None:
    stop = QuestionSamples.question(HookSamples.stop())
    table = PolicyTable([PolicyRow("worker stop", stop, ViewSamples.view("worker", WorkStop.REFUSE_WHILE_WORK_REMAINS), tuple(["samples.no-stop"])),
                         PolicyRow("main stop", stop, ViewSamples.view("main", WorkStop.REFUSE_WHILE_WORK_REMAINS, has_parent=False), tuple(["samples.no-stop"]))])
    assert table.failures(WorkerStopPolicy()) == ["main stop: refused nothing, the table says ('samples.no-stop',)"]
