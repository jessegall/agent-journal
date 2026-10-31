import json
from collections.abc import Mapping
from dataclasses import dataclass

from core.base.type_guards import is_list, is_mapping
from core.modules.plugins.support.plugin_card import PluginCard


@dataclass(frozen=True)
class PluginAnswer:
    """What a plugin printed for an event, version 4's line out: allow, refuse with a reason, or tell a line, with
    the cards it shows and the journal commands it runs; an empty output allows."""

    answer: str
    reason: str
    line: str
    cards: tuple[PluginCard, ...]
    commands: tuple[str, ...]
    output: str

    @classmethod
    def parsed(cls, output: str) -> "PluginAnswer":
        lines = [line for line in output.splitlines() if line.strip()]
        last_line = lines[-1] if lines else "{}"
        fields: object = json.loads(last_line)
        if not is_mapping(fields):
            fields = {}
        cards: object = fields["cards"] if "cards" in fields else None
        commands: object = fields["commands"] if "commands" in fields else None
        return cls(str(fields["answer"]) if "answer" in fields else "allow", cls.text(fields, "reason"), cls.text(fields, "tell"),
                   tuple(cls.card(entry) for entry in cards if is_mapping(entry)) if is_list(cards) else (),
                   tuple(str(line) for line in commands) if is_list(commands) else (), last_line)

    @staticmethod
    def text(fields: Mapping[object, object], key: str) -> str:
        return str(fields[key]) if key in fields else ""

    @classmethod
    def card(cls, entry: Mapping[object, object]) -> PluginCard:
        return PluginCard(cls.text(entry, "key"), cls.text(entry, "kind"), cls.text(entry, "label"), cls.text(entry, "tone"), cls.text(entry, "detail"))

    def has_output(self) -> bool:
        return bool(self.cards or self.commands)

    def is_refusal(self) -> bool:
        return self.answer == "refuse"
