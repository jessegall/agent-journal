from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field, replace

from engine.driver.block_condition import BlockCondition
from engine.driver.interval import Interval
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_message_type import AgentMessageType
from engine.driver.stored_message import StoredMessage
from engine.types.class_fields import class_fields
from functools import cache

LONGEST_LINE_CHARACTERS = 120
LONGEST_NOTICE_CHARACTERS = 800
LONGEST_FIELD_CHARACTERS = 80
BARE_TEMPLATE = "{text}"
CUT_MARK = "…"
CUT_END_CHARACTERS = 60


@dataclass(frozen=True)
class MessageTemplate:
    """An agent message template with delivery rules and text limits; declared path fields stay whole. A
    text per agent role, where one is declared, takes the place of the default text for an agent of that
    role. A line that requires a command about a row names the condition on that row that also closes its
    block."""

    key: str
    type: AgentMessageType
    text: str
    interval: Interval | None = None
    turn_limited: bool = True
    required_command: str | None = None
    closed_by: type[BlockCondition] | None = None
    plural_text: str = ""
    wakes_agent: bool = False
    path_fields: Sequence[str] = ()
    repeats_without_hook: bool = False
    id_field: str | None = None
    full_text: bool = False
    role_texts: Mapping[str, str] = field(default_factory=dict[str, str])

    # an agent message written as a class in its own file sets the fields as class attributes
    @classmethod
    @cache
    def declared(cls) -> "MessageTemplate":
        return MessageTemplate(**class_fields(cls, MessageTemplate))

    @property
    def limit(self) -> int:
        return LONGEST_NOTICE_CHARACTERS if self.type is AgentMessageType.NOTICE else LONGEST_LINE_CHARACTERS

    @property
    def is_mergeable(self) -> bool:
        return self.text != BARE_TEMPLATE and not self.required_command

    def agent_message(self, **fields: object) -> AgentMessage:
        return self.rendered(self.text, fields)

    @classmethod
    def restore(cls, text: str) -> AgentMessage:
        stored = StoredMessage.read(text)
        return cls(stored.key, AgentMessageType(stored.type), stored.text, plural_text=stored.plural_text,
                   id_field=stored.id_field, required_command=stored.required_command, path_fields=stored.path_fields).agent_message(**stored.fields)

    def merged(self, agent_messages: Sequence[AgentMessage]) -> AgentMessage:
        values = {name: ", ".join(dict.fromkeys(str(dict(agent_message.fields)[name]) for agent_message in agent_messages)) for name, _ in agent_messages[0].fields}
        text = self.plural_text or self.text
        if "count" not in values:
            text = text.replace("{count}", str(len(agent_messages)))
        rendered = self.rendered(text, values)
        return replace(rendered, interval=agent_messages[0].interval, turn_limited=agent_messages[0].turn_limited,
                       record_keys=tuple(dict.fromkeys(key for agent_message in agent_messages for key in agent_message.record_keys)))

    def rendered(self, text: str, fields: Mapping[str, object]) -> AgentMessage:
        values = fields
        if self.text != BARE_TEMPLATE:
            values = {name: str(value) if name in self.path_fields or name == self.id_field else self.field_text(value) for name, value in fields.items()}
        rendered = text.format(**values)
        line = rendered if self.full_text or self.path_fields or self.id_field else self.cut(rendered)
        return AgentMessage(self.key, self.type, line, self.interval, self.turn_limited, self.required_command.format(**fields) if self.required_command else "", tuple(fields.items()), self)

    def field_text(self, value: object) -> str:
        text = str(value)
        return text if len(text) <= LONGEST_FIELD_CHARACTERS else text[:LONGEST_FIELD_CHARACTERS - len(CUT_MARK)] + CUT_MARK

    def cut(self, line: str) -> str:
        if len(line) <= self.limit:
            return line
        end = min(CUT_END_CHARACTERS, self.limit // 2)
        return line[: self.limit - len(CUT_MARK) - end] + CUT_MARK + line[-end:]
