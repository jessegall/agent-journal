from dataclasses import dataclass

from core.base.driver.interval import Interval
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType

LONGEST_LINE_CHARACTERS = 120
LONGEST_FIELD_CHARACTERS = 80
BARE_TEMPLATE = "{text}"
CUT_MARK = "…"
CUT_END_CHARACTERS = 60


@dataclass(frozen=True)
class NudgeDeclaration:
    """A line a module can say to an agent, declared once: its key, its type, its words with {fields}, the
    interval before it may be said again, the longest it may be, cut in its middle so its instruction stays,
    whether a turn says it only once, as a reminder on a clock does not, and the command with {fields} that
    pays it, which makes the line a required_command. Each field is held to its own limit too."""

    key: str
    type: NudgeType
    text: str
    interval: Interval | None = None
    longest_characters: int = LONGEST_LINE_CHARACTERS
    turn_limited: bool = True
    required_command: str = ""

    def nudge(self, **fields: object) -> Nudge:
        return Nudge(self.key, self.type, self.cut(self.text.format(**fields) if self.text == BARE_TEMPLATE else self.text.format(**{name: self.field_text(value) for name, value in fields.items()})), self.interval, self.turn_limited, self.required_command.format(**fields))

    @staticmethod
    def field_text(value: object) -> str:
        text = str(value)
        return text if len(text) <= LONGEST_FIELD_CHARACTERS else text[:LONGEST_FIELD_CHARACTERS - len(CUT_MARK)] + CUT_MARK

    def cut(self, line: str) -> str:
        if len(line) <= self.longest_characters:
            return line
        end = min(CUT_END_CHARACTERS, self.longest_characters // 2)
        return line[: self.longest_characters - len(CUT_MARK) - end] + CUT_MARK + line[-end:]
