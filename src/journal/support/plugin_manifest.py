from dataclasses import fields, dataclass, field

from journal.models.support.card_kind import CardKind
from journal.support.event_window import EventWindow
from journal.support.plugin_service import PluginService
from journal.models.support.requirement import Requirement
from journal.models.support.setup_step import SetupStep


PUBLISHED = {"hears": "events", "holds": "blocks"}


@dataclass(frozen=True)
class PluginManifest:
    """What a plugin's journal-plugin.json says it is, runs, hears and holds, as read and checked; its hears and holds keys are read into events and blocks."""

    name: str = ""
    version: str = ""
    program: str = ""
    title: str = ""
    description: str = ""
    journal: str = ""
    protocol: int = 1
    events: tuple[str, ...] = ()
    blocks: tuple[EventWindow, ...] = ()
    services: tuple[PluginService, ...] = ()
    settings: str = ""
    skills: str = ""
    cards: tuple[CardKind, ...] = ()
    requires: dict[str, Requirement] = field(default_factory=dict)
    setup: tuple[SetupStep, ...] = ()
    installed: str = ""
    dashboard: dict = field(default_factory=dict)

    @classmethod
    def parsed(cls, data: dict) -> "PluginManifest":
        field_values = {key: value for key, value in data.items() if key not in PUBLISHED}
        return cls(**{**field_values, "events": tuple(data.get("hears", ())), "blocks": tuple(EventWindow.parsed(h) for h in data.get("holds", ())),
                      "services": tuple(PluginService.parsed(s) for s in data.get("services", ())), "cards": tuple(CardKind.parsed(c) for c in data.get("cards", ())),
                      "setup": tuple(SetupStep.parsed(s) for s in data.get("setup", ())), "requires": {program: Requirement.parsed(r) for program, r in data.get("requires", {}).items()}})

    def published(self) -> dict:
        """The manifest in the shape journal-plugin.json writes it, events and blocks under hears and holds."""
        names = {field: key for key, field in PUBLISHED.items()}
        return {names.get(field.name, field.name): getattr(self, field.name) for field in fields(self)} | {"services": [service.published() for service in self.services]}

    def has_window(self, key: str) -> bool:
        return any(window.event == key for window in self.blocks)

    def window_ms(self, key: str, ceiling_ms: int) -> int:
        return next(window.limit_ms(ceiling_ms) for window in self.blocks if window.event == key)

    @property
    def programs(self) -> list[str]:
        return [self.program, *(s.program for s in self.services if s.is_local)]

    def card_kind(self, kind: str) -> CardKind:
        return next((k for k in self.cards if k.kind == kind), CardKind(kind, self.name))
