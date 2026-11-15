from engine.driver.nudge import Nudge
from engine.driver.rule_answer import RuleAnswer
from engine.enums.nudge_type import NudgeType
from engine.driver.refusal_skip_hint import RefusalSkipHint
from engine.guard.errors.guard_refusal import SKIP_ALLOWED_CASE


def test_a_second_refusal_names_the_one_command_that_skips_its_rule():
    hinted = RefusalSkipHint.hinted(RuleAnswer.refused(Nudge("sample.rule", NudgeType.REFUSAL, "a sample refusal")), "processes.reading")
    assert hinted.refusal == f"a sample refusal ({SKIP_ALLOWED_CASE}: journal refusal skip processes.reading --reason '<why it is wrong here>')"


def test_a_refusal_that_has_its_hint_gets_it_once():
    once = RefusalSkipHint.text("a sample refusal", "processes.reading")
    assert RefusalSkipHint.text(once, "processes.reading") == once
