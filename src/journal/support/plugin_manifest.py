from dataclasses import dataclass, field

from journal.models.support.card_kind import CardKind
from journal.support.event_window import EventWindow
from journal.support.plugin_service import PluginService
from journal.models.support.requirement import Requirement
from journal.models.support.setup_step import SetupStep


@dataclass(frozen=True)
class PluginManifest:
    """What a plugin's journal-plugin.json says it is, runs, hears and holds, as read and checked."""

    name: str = ""
    version: str = ""
    program: str = ""
    title: str = ""
    description: str = ""
    journal: str = ""
    protocol: int = 1
    hears: tuple[str, ...] = ()
    holds: tuple[EventWindow, ...] = ()
    services: tuple[PluginService, ...] = ()
    settings: str = ""
    skills: str = ""
    cards: tuple[CardKind, ...] = ()
    requires: dict[str, Requirement] = field(default_factory=dict)
    setup: tuple[SetupStep, ...] = ()
    installed: str = ""
    dashboard: dict = field(default_factory=dict)

    @classmethod
    def from_json(cls, data: dict) -> "PluginManifest":
        return cls(**{**data, **{key: tuple(data[key]) for key in ("hears",) if key in data}, "holds": tuple(EventWindow.from_json(h) for h in data.get("holds", ())),
                      "services": tuple(PluginService.from_json(s) for s in data.get("services", ())), "cards": tuple(CardKind.from_json(c) for c in data.get("cards", ())),
                      "setup": tuple(SetupStep.from_json(s) for s in data.get("setup", ())), "requires": {program: Requirement.from_json(r) for program, r in data.get("requires", {}).items()}})

    def has_window(self, key: str) -> bool:
        return any(window.event == key for window in self.holds)

    def window_ms(self, key: str, ceiling_ms: int) -> int:
        return next(window.limit_ms(ceiling_ms) for window in self.holds if window.event == key)

    @property
    def programs(self) -> list[str]:
        return [self.program, *(s.program for s in self.services if s.is_in_its_folder)]

    def card_kind(self, kind: str) -> CardKind:
        return next((k for k in self.cards if k.kind == kind), CardKind(kind, self.name))
