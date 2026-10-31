from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.rule_record import RuleRecord


@dataclass(frozen=True)
class RuleAnswers:
    """What the rules on one hook said, in the order they were asked, with the layers that were active."""

    layers: Sequence[str]
    rules: Sequence[RuleRecord]
    holds_lines: bool = False

    @property
    def spoken(self) -> list[RuleRecord]:
        return [rule for rule in self.rules if rule.answer is not None]

    @property
    def refusal(self) -> str:
        return next((rule.answer.refusal for rule in self.spoken if rule.answer is not None and rule.answer.refusal), "")

    @property
    def lines(self) -> list[str]:
        return [line for rule in self.spoken if rule.answer is not None for line in rule.answer.lines]

    @property
    def commands(self) -> list[tuple[str, Command[object]]]:
        return [(rule.name, command) for rule in self.spoken if rule.answer is not None for command in rule.answer.commands]

    def metadata(self) -> dict[str, object]:
        return {"layers": list(self.layers), "rules": [{"rule": rule.name, "layer": rule.layer, "outcome": rule.outcome} for rule in self.rules]}
