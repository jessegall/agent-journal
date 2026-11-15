import re
from collections.abc import Iterable
from dataclasses import dataclass, field
from string import Formatter

from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate

ANY_VALUE = "[^\n]+?"


@dataclass(frozen=True)
class ExpectedMessage:
    """An agent message a story expects, named by its declaration and the values it knows. A line matches the
    declaration's own template, a value left out matches any text and capitals do not count; a kept agent message
    matches by its key and fields. A story so holds none of an agent message's words, and a change of wording breaks
    no story."""

    declaration: MessageTemplate
    values: dict[str, object] = field(default_factory=dict[str, object])

    def pattern(self) -> re.Pattern[str]:
        parts = []
        for literal, name, _, _ in Formatter().parse(self.declaration.text):
            parts.append(re.escape(literal))
            if name is None:
                continue
            parts.append(re.escape(str(self.values[name])) if name in self.values else ANY_VALUE)
        return re.compile("".join(parts), re.IGNORECASE | re.DOTALL)

    def matches_text(self, text: str) -> bool:
        return self.pattern().search(text) is not None

    def matches_lines(self, lines: Iterable[str]) -> bool:
        return any(self.matches_text(line) for line in lines)

    def is_kept_as(self, agent_message: AgentMessage) -> bool:
        fields = dict(agent_message.fields)
        return agent_message.key == self.declaration.key and all(str(fields.get(name)) == str(value) for name, value in self.values.items())


def expected_agent_message(declaration: MessageTemplate, **values: object) -> ExpectedMessage:
    return ExpectedMessage(declaration, values)
