from engine.agent_machine.record.question import Question
from engine.driver.hook_event import HookEvent
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.enums.decision_class import DecisionClass
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.view_samples import ViewSamples
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.support.walk_answer_policy import WalkAnswerPolicy

EDIT = Question.posed(HookEvent.parsed(HookSamples.edit("a.py").body))
VIEW = ViewSamples.view("main", WorkStop.REFUSE_WHILE_WORK_REMAINS)


def walk_class(rule: str) -> DecisionClass:
    answers = RuleAnswers([], [RuleRecord(rule, "", "refused", RuleAnswer(refusal="read your messages first"))])
    return WalkAnswerPolicy(answers, frozenset({"messages.unread-write"})).refusals(EDIT, VIEW)[0].decision_class


def test_an_old_holds_tool_refusal_is_a_hold_and_any_other_a_refusal():
    assert [walk_class(rule) for rule in ("messages.unread-write", "drivers.agent-block", "triggers.phrase")] == [DecisionClass.HOLD, DecisionClass.HOLD, DecisionClass.REFUSE]
