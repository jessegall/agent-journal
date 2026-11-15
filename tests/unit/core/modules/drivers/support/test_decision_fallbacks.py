from engine.driver.hook_event import HookEvent
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.commands.request_agent_step.request_agent_step import RequestAgentStep
from core.modules.drivers.support.decision_fallbacks import BUSY_TEXT, MISSED_CHECK, DecisionFallbacks

WALK = RuleAnswers([RuleRecord("messages.unread-write", "refused", RuleAnswer(refusal="read your messages", commands=tuple([RequestAgentStep(tuple([4]), "walk")])))])
TRIGGERED = RuleAnswers([RuleRecord("triggers.phrase", "refused", RuleAnswer(refusal="that phrase is denied"))])


def lost(sample, answers: RuleAnswers = WALK) -> RuleAnswers:
    return DecisionFallbacks.missed_check(HookEvent.parsed(sample.body), 4, answers)


def test_a_tool_call_whose_check_was_lost_is_refused_as_busy_with_nothing_of_the_walk_kept():
    answers = lost(HookSamples.edit("a.py"))
    assert (answers.refusal, answers.commands) == (BUSY_TEXT, [])


def test_a_stop_whose_check_was_lost_passes_and_asks_for_a_step():
    answers = lost(HookSamples.stop())
    assert (answers.refusal, answers.commands) == ("", [(MISSED_CHECK, RequestAgentStep(tuple([4]), MISSED_CHECK))])


def test_a_prompt_whose_check_was_lost_keeps_only_a_trigger_refusal():
    assert lost(HookSamples.prompt("go"), TRIGGERED).refusal == "that phrase is denied"
    assert lost(HookSamples.prompt("go")).refusal == ""
