from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.nudge import Nudge
from engine.driver.rule_record import RuleRecord
from engine.agent_machine.record.stop_check import StopCheck


@dataclass(frozen=True)
class RuleAnswers:
    """What one hook's answer said, source by source: its refusal, its lines, its commands and how each
    constraint judged a stop."""

    rules: Sequence[RuleRecord]
    skipped_lines: frozenset[tuple[str, str]] = frozenset()
    stop_checks: Sequence[StopCheck] = ()

    @property
    def answered(self) -> list[RuleRecord]:
        return [rule for rule in self.rules if rule.answer is not None]

    @property
    def refusal(self) -> str:
        refused = [rule.answer for rule in self.answered if rule.answer is not None and rule.answer.refusal]
        return max(refused, key=lambda answer: answer.refusal_priority).refusal if refused else ""

    @property
    def rewriters(self) -> list[RuleRecord]:
        return [rule for rule in self.answered if rule.answer is not None and rule.answer.rewrites]

    @property
    def rewriter(self) -> RuleRecord | None:
        rewriters = self.rewriters
        return rewriters[0] if len(rewriters) == 1 else None

    @property
    def refused_rewriters(self) -> set[str]:
        return {rule.name for rule in self.rewriters} if self.refusal else set()

    @property
    def updated_input(self) -> Mapping[str, object]:
        rewriter = self.rewriter
        return rewriter.answer.updated_input if rewriter is not None and rewriter.answer is not None else {}

    @property
    def rewriter_name(self) -> str:
        rewriter = self.rewriter
        return rewriter.name if rewriter is not None else ""

    @property
    def lines(self) -> list[str]:
        return [line for _, line in self.rule_lines]

    @property
    def rule_lines(self) -> list[tuple[str, str]]:
        first_rule: dict[str, str] = {}
        for rule in self.answered:
            for nudge in rule.answer.line_nudges if rule.answer is not None else ():
                first_rule.setdefault(nudge.key, rule.name)
        return [(first_rule[nudge.key], nudge.text) for nudge in self.delivered_nudges]

    @property
    def line_nudges(self) -> list[Nudge]:
        return Nudge.collapsed(nudge for rule in self.answered if rule.answer is not None for nudge in rule.answer.line_nudges)

    @property
    def delivered_nudges(self) -> list[Nudge]:
        delivered = {(nudge.key, nudge.text): nudge for nudge in self.line_nudges if (nudge.key, nudge.text) not in self.skipped_lines}
        return list(delivered.values())

    @property
    def refusal_nudges(self) -> list[Nudge]:
        return [nudge for rule in self.answered if rule.answer is not None for nudge in rule.answer.nudges if rule.answer.refusal and nudge.text == rule.answer.refusal]

    @property
    def labelled_lines(self) -> list[str]:
        return [nudge.labelled for nudge in (*self.delivered_nudges, *self.refusal_nudges)]

    @property
    def commands(self) -> list[tuple[str, Command[object]]]:
        return [(rule.name, command) for rule in self.answered if rule.answer is not None for command in (*rule.answer.commands, *(rule.answer.commands_unrefused if not self.refusal else ()))]

    @property
    def terminal(self) -> str:
        return "\n".join(rule.answer.terminal for rule in self.answered if rule.answer is not None and rule.answer.terminal)

    def metadata(self) -> dict[str, object]:
        return {"rules": [rule.saved_fields for rule in self.rules], "terminal": self.terminal, "stop_checks": [check.saved_fields for check in self.stop_checks]}
