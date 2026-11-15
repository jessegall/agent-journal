from dataclasses import replace

from engine.driver.rule_answer import RuleAnswer
from engine.guard.errors.guard_refusal import SKIP_ALLOWED_CASE


class RefusalSkipHint:
    """The refusal of a rule that refused the agent's last refused hook too, with the command that skips it once;
    the old walk and every policy of the new driver give it alike, and a refusal that has it gets it once."""

    @staticmethod
    def text(refusal: str, rule_name: str) -> str:
        hint = f" ({SKIP_ALLOWED_CASE}: journal refusal skip {rule_name} --reason '<why it is wrong here>')"
        return refusal if refusal.endswith(hint) else refusal + hint

    @staticmethod
    def hinted(answer: RuleAnswer, rule_name: str) -> RuleAnswer:
        return replace(answer, refusal=RefusalSkipHint.text(answer.refusal, rule_name))
