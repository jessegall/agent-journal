import json
from collections.abc import Mapping
from dataclasses import dataclass, replace

from engine.types.type_guards import is_list, is_mapping
from core.modules.plugins.support.plugin_card import PluginCard
from core.modules.plugins.support.plugin_judge_run import PluginJudgeRun

OLD_TYPE_KEY = "kind"


MOST_COMMAND_LINES = 20
COMMANDS_KEY = "commands"


@dataclass(frozen=True)
class PluginAnswer:
    """What a plugin printed for an event, version 4's line out: allow, refuse with a reason, queue a judge run, or tell a line,
    with the cards it shows, the journal commands it runs, the skills it requires and how long it took in
    milliseconds; an empty output allows.
    """

    answer: str
    reason: str
    line: str
    cards: tuple[PluginCard, ...]
    commands: tuple[str, ...]
    output: str
    required_skills: tuple[str, ...]
    judged_ms: str = ""
    run: PluginJudgeRun | None = None

    @classmethod
    def parsed(cls, output: str) -> "PluginAnswer":
        lines = [line for line in output.splitlines() if line.strip()]
        last_line = lines[-1] if lines else "{}"
        fields: object = json.loads(last_line)
        if not is_mapping(fields):
            fields = {}
        cards: object = fields["cards"] if "cards" in fields else None
        commands: object = fields[COMMANDS_KEY] if COMMANDS_KEY in fields else None
        skills: object = fields["require_skills"] if "require_skills" in fields else None
        return cls(str(fields["answer"]) if "answer" in fields else "allow", cls.text(fields, "reason"), cls.text(fields, "tell"),
                   tuple(cls.card(entry) for entry in cards if is_mapping(entry)) if is_list(cards) else (),
                   tuple(str(line) for line in commands) if is_list(commands) else (), last_line,
                   tuple(str(name) for name in skills) if is_list(skills) else (), cls.text(fields, "judged_ms"), PluginJudgeRun.parsed(fields))

    @classmethod
    def entry_type(cls, entry: Mapping[object, object]) -> str:
        return cls.text(entry, "type") or cls.text(entry, OLD_TYPE_KEY)

    @staticmethod
    def text(fields: Mapping[object, object], key: str) -> str:
        return str(fields[key]) if key in fields else ""

    @classmethod
    def card(cls, entry: Mapping[object, object]) -> PluginCard:
        return PluginCard(cls.text(entry, "key"), cls.entry_type(entry), cls.text(entry, "label"), cls.text(entry, "tone"), cls.text(entry, "detail"))

    def duration_text(self) -> str:
        return f"{int(self.judged_ms) / 1000:.1f} s" if self.judged_ms else ""

    def without_commands(self) -> "PluginAnswer":
        fields = {key: value for key, value in json.loads(self.output or "{}").items() if key != COMMANDS_KEY}
        return replace(self, commands=(), output=json.dumps(fields))

    def has_output(self) -> bool:
        return bool(self.cards or self.commands or self.required_skills)

    def is_refusal(self) -> bool:
        return self.answer == "refuse"

    def is_queue(self) -> bool:
        return self.answer == "queue" and self.run is not None
