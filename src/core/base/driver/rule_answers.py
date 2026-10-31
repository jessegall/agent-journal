from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.rule_record import RuleRecord


@dataclass(frozen=True)
class RuleAnswers:
    """What the rules on one hook said, in the order they were asked, with the layers that were active."""

    layers: Sequence[str]
    rules: Sequence[RuleRecord]
    delays_lines: bool = False

    @property
    def answered(self) -> list[RuleRecord]:
        return [rule for rule in self.rules if rule.answer is not None]

    @property
    def refusal(self) -> str:
        refusal = next((rule.answer.refusal for rule in self.answered if rule.answer is not None and rule.answer.refusal), "")
        return refusal or self.double_rewrite

    @property
    def rewriters(self) -> list[RuleRecord]:
        return [rule for rule in self.answered if rule.answer is not None and rule.answer.updated_input]

    @property
    def double_rewrite(self) -> str:
        names = [rule.name for rule in self.rewriters]
        if len(names) < 2:
            return ""
        return f"{', '.join(names[:-1])} and {names[-1]} each rewrite the input of this tool, and only one rule may"

    @property
    def updated_input(self) -> Mapping[str, object]:
        rewriters = self.rewriters
        return rewriters[0].answer.updated_input if len(rewriters) == 1 and rewriters[0].answer is not None else {}

    @property
    def rewritten_by(self) -> str:
        rewriters = self.rewriters
        return rewriters[0].name if len(rewriters) == 1 else ""

    @property
    def lines(self) -> list[str]:
        return [line for _, line in self.rule_lines]

    @property
    def rule_lines(self) -> list[tuple[str, str]]:
        return [(rule.name, line) for rule in self.answered if rule.answer is not None for line in rule.answer.lines]

    @property
    def commands(self) -> list[tuple[str, Command[object]]]:
        return [(rule.name, command) for rule in self.answered if rule.answer is not None for command in rule.answer.commands]

    def metadata(self) -> dict[str, object]:
        return {"layers": list(self.layers), "rules": [{"rule": rule.name, "layer": rule.layer, "outcome": rule.outcome} for rule in self.rules]}
