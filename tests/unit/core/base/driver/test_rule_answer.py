from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.hook_reply import HookReply
from core.base.driver.rule_answer import RuleAnswer


@dataclass(frozen=True)
class SampleEnd(Command[None]):
    """A sample command that ends a row."""

    row_id: int


def test_each_answer_says_what_it_did_and_only_a_refusal_or_a_let_through_ends_the_walk():
    answers = [RuleAnswer.through(), RuleAnswer.told("a line"), RuleAnswer.refused("no"), RuleAnswer.let_through_now("go on")]
    assert [(answer.said, answer.last) for answer in answers] == [("through", False), ("told", False), ("refused", True), ("told", True)]


def test_commands_ride_on_an_answer_and_ending_a_layer_marks_it():
    answer = RuleAnswer.told("back to work").running(SampleEnd(1)).ending_layer(SampleEnd(2))
    assert list(answer.commands) == [SampleEnd(1), SampleEnd(2)] and answer.ends_layer and answer.lines == ("back to work",)


def test_a_reply_that_lets_the_hook_through_has_no_refusal_and_reads_as_json():
    assert HookReply.let_through("a line").json() == {"refusal": "", "lines": ["a line"], "hook_call_id": None}
