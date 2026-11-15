from engine.driver.agent_message import AgentMessage
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_message_type import AgentMessageType
from engine.driver.refusal_skip_hint import RefusalSkipHint
from engine.guard.errors.guard_refusal import SKIP_ALLOWED_CASE


def test_a_second_refusal_names_the_one_command_that_skips_its_rule():
    hinted = RefusalSkipHint.hinted(RuleAnswer.refused(AgentMessage("sample.rule", AgentMessageType.REFUSAL, "a sample refusal")), "processes.reading")
    assert hinted.refusal == f"a sample refusal ({SKIP_ALLOWED_CASE}: journal refusal skip processes.reading --reason '<why it is wrong here>')"


def test_a_refusal_that_has_its_hint_gets_it_once():
    once = RefusalSkipHint.text("a sample refusal", "processes.reading")
    assert RefusalSkipHint.text(once, "processes.reading") == once
