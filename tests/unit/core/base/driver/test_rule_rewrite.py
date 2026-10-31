from core.base.driver.hook_reply import HookReply
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_record import RuleRecord


def record(name: str, answer: RuleAnswer) -> RuleRecord:
    return RuleRecord(name, "lead", answer.outcome, answer)


def test_an_answer_carries_the_new_input_of_the_tool_and_names_the_outcome_rewritten():
    answer = RuleAnswer.rewritten({"command": "journal-run 4 -- ls"})
    assert dict(answer.updated_input) == {"command": "journal-run 4 -- ls"} and answer.outcome == "rewritten"
    assert dict(RuleAnswer.allowed().updated_input) == {}


def test_one_rewrite_on_a_hook_is_the_hooks_new_input_and_names_its_rule():
    answers = RuleAnswers(["lead"], [record("a.run", RuleAnswer.rewritten({"command": "x"})), record("b.line", RuleAnswer.with_lines("a line"))])
    assert dict(answers.updated_input) == {"command": "x"} and answers.rewritten_by == "a.run" and answers.refusal == ""


def test_two_rules_that_rewrite_one_hook_are_refused_naming_both():
    answers = RuleAnswers(["lead"], [record("a.run", RuleAnswer.rewritten({"command": "x"})), record("b.run", RuleAnswer.rewritten({"command": "y"}))])
    assert "a.run" in answers.refusal and "b.run" in answers.refusal and dict(answers.updated_input) == {}


def test_a_reply_carries_the_new_input_of_the_tool():
    assert HookReply(updated_input={"command": "x"}).json()["updated_input"] == {"command": "x"}
    assert HookReply.allowed("a line").json()["updated_input"] == {}
