from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.driver.interval import Interval
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType

LONGEST_LINE_CHARACTERS = 120
LONGEST_INFO_CHARACTERS = 800
LONGEST_FIELD_CHARACTERS = 80
AUTHORED_LINE_CHARACTERS = 2000
BARE_TEMPLATE = "{text}"
CUT_MARK = "…"
CUT_END_CHARACTERS = 60


@dataclass(frozen=True)
class NudgeDeclaration:
    """A line a module can say to an agent, declared once: its key, its type, its rendered with {fields}, the
    interval before it may be said again, the longest it may be (120 characters, and 800 for info, which
    explains big things), cut in its middle so its ask stays, whether a turn says it only once, as a reminder
    on a clock does not, and the command with {fields} that pays it, which makes the line a required_command.
    Each field is held to its own limit too. Lines of this key in one hook are written as one, each field
    listing its values, in plural_text when it has one. A line that wakes its agent is typed to it when
    idle."""

    key: str
    type: NudgeType
    text: str
    interval: Interval | None = None
    longest_characters: int | None = None
    turn_limited: bool = True
    required_command: str = ""
    plural_text: str = ""
    field_limit_characters: int = LONGEST_FIELD_CHARACTERS
    wakes_agent: bool = False

    @property
    def limit(self) -> int:
        if self.longest_characters is not None:
            return self.longest_characters
        return LONGEST_INFO_CHARACTERS if self.type is NudgeType.INFO else LONGEST_LINE_CHARACTERS

    @property
    def is_mergeable(self) -> bool:
        return self.text != BARE_TEMPLATE and not self.required_command

    def nudge(self, **fields: object) -> Nudge:
        return self.rendered(self.text, fields)

    def merged(self, nudges: Sequence[Nudge]) -> Nudge:
        values = {name: ", ".join(dict.fromkeys(str(dict(nudge.fields)[name]) for nudge in nudges)) for name, _ in nudges[0].fields}
        return self.rendered(self.plural_text or self.text, values)

    def rendered(self, text: str, fields: Mapping[str, object]) -> Nudge:
        rendered = text.format(**fields) if self.text == BARE_TEMPLATE else text.format(**{name: self.field_text(value) for name, value in fields.items()})
        return Nudge(self.key, self.type, self.cut(rendered), self.interval, self.turn_limited, self.required_command.format(**fields), tuple(fields.items()), self)

    def field_text(self, value: object) -> str:
        text = str(value)
        return text if len(text) <= self.field_limit_characters else text[:self.field_limit_characters - len(CUT_MARK)] + CUT_MARK

    def cut(self, line: str) -> str:
        if len(line) <= self.limit:
            return line
        end = min(CUT_END_CHARACTERS, self.limit // 2)
        return line[: self.limit - len(CUT_MARK) - end] + CUT_MARK + line[-end:]
