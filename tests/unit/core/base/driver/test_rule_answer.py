from tests.unit.core.base.driver.nudge_sample import sample_nudge
from dataclasses import dataclass

from engine.command.command import Command
from core.base.driver.hook_reply import HookReply
from core.base.driver.rule_answer import RuleAnswer


@dataclass(frozen=True)
class SampleEnd(Command[None]):
    """A sample command that ends a row."""

    row_id: int


def test_each_answer_names_its_outcome_and_only_a_refusal_or_an_allowance_now_ends_the_walk():
    answers = [RuleAnswer.allowed(), RuleAnswer.with_nudges(sample_nudge("a line")), RuleAnswer.refused(sample_nudge("no")), RuleAnswer.final_allowance(sample_nudge("go on"))]
    assert [(answer.outcome, answer.last) for answer in answers] == [("allowed", False), ("lines", False), ("refused", True), ("lines", True)]


def test_commands_ride_on_an_answer_and_ending_a_layer_marks_it():
    answer = RuleAnswer.with_nudges(sample_nudge("back to work")).running(SampleEnd(1)).ending_layer(SampleEnd(2))
    assert list(answer.commands) == [SampleEnd(1), SampleEnd(2)] and answer.ends_layer and list(answer.lines) == ["back to work"]


def test_a_reply_that_lets_the_hook_through_has_no_refusal_and_reads_as_json():
    assert HookReply.allowed("a line").json() == {"refusal": "", "lines": ["a line"], "hook_call_id": None, "updated_input": {}, "terminal": "", "halt": ""}


def test_a_halted_reply_carries_only_its_stop_line_as_json():
    assert HookReply.halted("stopped until 14:00").json() == {"refusal": "", "lines": [], "hook_call_id": None, "updated_input": {}, "terminal": "", "halt": "stopped until 14:00"}
