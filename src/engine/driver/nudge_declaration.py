from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field, replace

from engine.driver.interval import Interval
from engine.driver.nudge import Nudge
from engine.enums.nudge_type import NudgeType
from engine.driver.stored_nudge import StoredNudge

LONGEST_LINE_CHARACTERS = 120
LONGEST_NOTICE_CHARACTERS = 800
LONGEST_FIELD_CHARACTERS = 80
BARE_TEMPLATE = "{text}"
CUT_MARK = "…"
CUT_END_CHARACTERS = 60


@dataclass(frozen=True)
class NudgeDeclaration:
    """An agent message template with delivery rules and text limits; declared path fields stay whole. A text per
    agent role, where one is declared, takes the place of the default text for an agent of that role."""

    key: str
    type: NudgeType
    text: str
    interval: Interval | None = None
    turn_limited: bool = True
    required_command: str | None = None
    plural_text: str = ""
    wakes_agent: bool = False
    path_fields: Sequence[str] = ()
    repeats_without_hook: bool = False
    id_field: str | None = None
    full_text: bool = False
    role_texts: Mapping[str, str] = field(default_factory=dict[str, str])

    @property
    def limit(self) -> int:
        return LONGEST_NOTICE_CHARACTERS if self.type is NudgeType.NOTICE else LONGEST_LINE_CHARACTERS

    @property
    def is_mergeable(self) -> bool:
        return self.text != BARE_TEMPLATE and not self.required_command

    def nudge(self, **fields: object) -> Nudge:
        return self.rendered(self.text, fields)

    @classmethod
    def restore(cls, text: str) -> Nudge:
        stored = StoredNudge.read(text)
        return cls(stored.key, NudgeType(stored.type), stored.text, plural_text=stored.plural_text,
                   id_field=stored.id_field, required_command=stored.required_command, path_fields=stored.path_fields).nudge(**stored.fields)

    def merged(self, nudges: Sequence[Nudge]) -> Nudge:
        values = {name: ", ".join(dict.fromkeys(str(dict(nudge.fields)[name]) for nudge in nudges)) for name, _ in nudges[0].fields}
        text = self.plural_text or self.text
        if "count" not in values:
            text = text.replace("{count}", str(len(nudges)))
        rendered = self.rendered(text, values)
        return replace(rendered, interval=nudges[0].interval, turn_limited=nudges[0].turn_limited,
                       record_keys=tuple(dict.fromkeys(key for nudge in nudges for key in nudge.record_keys)))

    def rendered(self, text: str, fields: Mapping[str, object]) -> Nudge:
        values = fields
        if self.text != BARE_TEMPLATE:
            values = {name: str(value) if name in self.path_fields or name == self.id_field else self.field_text(value) for name, value in fields.items()}
        rendered = text.format(**values)
        line = rendered if self.full_text or self.path_fields or self.id_field else self.cut(rendered)
        return Nudge(self.key, self.type, line, self.interval, self.turn_limited, self.required_command.format(**fields) if self.required_command else "", tuple(fields.items()), self)

    def field_text(self, value: object) -> str:
        text = str(value)
        return text if len(text) <= LONGEST_FIELD_CHARACTERS else text[:LONGEST_FIELD_CHARACTERS - len(CUT_MARK)] + CUT_MARK

    def cut(self, line: str) -> str:
        if len(line) <= self.limit:
            return line
        end = min(CUT_END_CHARACTERS, self.limit // 2)
        return line[: self.limit - len(CUT_MARK) - end] + CUT_MARK + line[-end:]
