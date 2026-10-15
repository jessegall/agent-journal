import json
from pathlib import Path

from journal.features.registry import Registry
from journal.models.actor import Actor
from journal.models.setting import Setting
from journal.repositories.settings import PROJECT, Settings

FIXTURE = Path(__file__).with_name("settings.json")
STORED = "v3.settings"
FEATURES = {"messages": "messages", "ask_questions": "questions", "facts": "memory", "memory_checkpoints": "memory", "rules": "memory", "reminders": "memory", "skill_loading": "skills",
            "triggers": "triggers", "checks": "checks", "long_commands": "shell", "chat_etiquette": "etiquette", "form_of_address": "voices", "agent_profiles": "profiles",
            "helpers": "workers", "plans": "plans", "sequences": "sequences", "journal_laws": "laws", "session_briefing": "briefing", "work_tracking": "tasks", "avatar": "voices"}


NOT_PORTED = ("kanban", "boards", "tickets")
"""Features of version 3 that version 4 does not carry: their switches read off and stay off, so the viewer shows no Board."""


class V3Settings:
    """The settings tree version 3's viewer shows: the shape recorded from version 3, with what the user changed laid over, and the feature switches read from and written to version 4's."""

    def __init__(self, settings: Settings, registry: Registry) -> None:
        self.settings, self.registry = settings, registry
        self._fixture = json.loads(FIXTURE.read_text())

    def tree(self, environment_id: int) -> dict:
        tree = self.merged(self._fixture, self.settings.get(PROJECT, STORED, {}) or {})
        features = dict(tree.get("features", {}))
        for old, new in FEATURES.items():
            feature = next((f for f in self.registry.features if f.name == new), None)
            if feature:
                features[old] = self.registry.is_on(feature, environment_id)
        for name in NOT_PORTED:
            features[name] = False
        tree["features"] = features
        tree["avatar"] = {"shown": self.settings.get(PROJECT, "avatar.shown", "always")}
        return tree

    def save(self, values: dict, by: Actor) -> dict:
        for old, on in (values.get("features") or {}).items():
            if old in FEATURES:
                self._set(f"features.{FEATURES[old]}", bool(on), by)
        if "avatar" in values and "shown" in values["avatar"]:
            self._set("avatar.shown", values["avatar"]["shown"], by)
        kept = self.merged(self.settings.get(PROJECT, STORED, {}) or {}, values)
        self._set(STORED, kept, by)
        return kept

    def _set(self, key: str, value, by: Actor) -> None:
        found = [s for s in self.settings.in_(PROJECT) if s.key == key]
        self.settings.save(found[0].with_(value=value) if found else Setting(environment_id=PROJECT, key=key, value=value), by)

    @classmethod
    def merged(cls, base: dict, over: dict) -> dict:
        out = dict(base)
        for key, value in over.items():
            out[key] = cls.merged(out[key], value) if isinstance(value, dict) and isinstance(out.get(key), dict) else value
        return out
