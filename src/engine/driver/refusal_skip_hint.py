from dataclasses import replace

from engine.driver.rule_answer import RuleAnswer
from engine.guard.errors.guard_refusal import SKIP_ALLOWED_CASE


class RefusalSkipHint:
    """The refusal of a rule that refused the agent's last refused hook too, with the command that skips it once;
    the old walk and the policies of the new driver that a rule backs give it alike."""

    @staticmethod
    def hinted(answer: RuleAnswer, rule_name: str) -> RuleAnswer:
        return replace(answer, refusal=f"{answer.refusal} ({SKIP_ALLOWED_CASE}: journal refusal skip {rule_name} --reason '<why it is wrong here>')")
