import re
from collections.abc import Iterable
from dataclasses import dataclass, field
from string import Formatter

from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration

ANY_VALUE = "[^\n]+?"


@dataclass(frozen=True)
class ExpectedNudge:
    """A nudge a story expects, named by its declaration and the values it knows. A line matches the
    declaration's own template, a value left out matches any text and capitals do not count; a kept nudge
    matches by its key and fields. A story so holds none of a nudge's words, and a change of wording breaks
    no story."""

    declaration: NudgeDeclaration
    values: dict[str, object] = field(default_factory=dict[str, object])

    def pattern(self) -> re.Pattern[str]:
        parts = []
        for literal, name, _, _ in Formatter().parse(self.declaration.text):
            parts.append(re.escape(literal))
            if name is None:
                continue
            parts.append(re.escape(str(self.values[name])) if name in self.values else ANY_VALUE)
        return re.compile("".join(parts), re.IGNORECASE | re.DOTALL)

    def is_in(self, text: str) -> bool:
        return self.pattern().search(text) is not None

    def is_in_any(self, lines: Iterable[str]) -> bool:
        return any(self.is_in(line) for line in lines)

    def is_kept_as(self, nudge: Nudge) -> bool:
        fields = dict(nudge.fields)
        return nudge.key == self.declaration.key and all(str(fields.get(name)) == str(value) for name, value in self.values.items())


def expected_nudge(declaration: NudgeDeclaration, **values: object) -> ExpectedNudge:
    return ExpectedNudge(declaration, values)
