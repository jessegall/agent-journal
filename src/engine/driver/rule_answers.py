from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage
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
            for agent_message in rule.answer.line_agent_messages if rule.answer is not None else ():
                first_rule.setdefault(agent_message.key, rule.name)
        return [(first_rule[agent_message.key], agent_message.text) for agent_message in self.delivered_agent_messages]

    @property
    def line_agent_messages(self) -> list[AgentMessage]:
        return AgentMessage.collapsed(agent_message for rule in self.answered if rule.answer is not None for agent_message in rule.answer.line_agent_messages)

    @property
    def delivered_agent_messages(self) -> list[AgentMessage]:
        delivered = {(agent_message.key, agent_message.text): agent_message for agent_message in self.line_agent_messages if (agent_message.key, agent_message.text) not in self.skipped_lines}
        return list(delivered.values())

    @property
    def refusal_agent_messages(self) -> list[AgentMessage]:
        return [agent_message for rule in self.answered if rule.answer is not None for agent_message in rule.answer.agent_messages if rule.answer.refusal and agent_message.text == rule.answer.refusal]

    @property
    def labelled_lines(self) -> list[str]:
        return [agent_message.labelled for agent_message in (*self.delivered_agent_messages, *self.refusal_agent_messages)]

    @property
    def commands(self) -> list[tuple[str, Command[object]]]:
        return [(rule.name, command) for rule in self.answered if rule.answer is not None for command in (*rule.answer.commands, *(rule.answer.commands_unrefused if not self.refusal else ()))]

    @property
    def terminal(self) -> str:
        return "\n".join(rule.answer.terminal for rule in self.answered if rule.answer is not None and rule.answer.terminal)

    def metadata(self) -> dict[str, object]:
        return {"rules": [rule.saved_fields for rule in self.rules], "terminal": self.terminal, "stop_checks": [check.saved_fields for check in self.stop_checks]}
