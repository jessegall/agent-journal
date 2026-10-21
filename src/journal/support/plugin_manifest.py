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
    """The program run for each event it hears, a path inside the plugin's folder."""
    title: str = ""
    description: str = ""
    journal: str = ""
    """The least journal version it runs on."""
    protocol: int = 1
    hears: tuple[str, ...] = ()
    """The events it is sent: agent events by name, and rows as <table>.created, .updated or .deleted."""
    holds: tuple[EventWindow, ...] = ()
    """The events of those it hears that it answers before the agent goes on, each inside its window."""
    services: tuple[PluginService, ...] = ()
    """Processes kept running beside it: each a name, a command, a restart policy and an optional when test."""
    settings: str = ""
    """A path to its settings schema file."""
    skills: str = ""
    """A folder of its skills."""
    cards: tuple[CardKind, ...] = ()
    """The kinds of card it shows, each a kind, a label and a tone."""
    requires: dict[str, Requirement] = field(default_factory=dict)
    """Each program it needs, with the shell check that it is there and a hint for when it is not."""
    setup: tuple[SetupStep, ...] = ()
    """Steps run in order at install in its folder, each a name and a shell line to run."""
    installed: str = ""
    """A command run after the setup, whose JSON answer fills its settings."""
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
        """The files it runs from its folder: its program and each service's that lies there."""
        return [self.program, *(s.program for s in self.services if s.is_in_its_folder)]

    def card_kind(self, kind: str) -> CardKind:
        """The kind of card declared under that name; one not declared takes the plugin's name and the plug."""
        return next((k for k in self.cards if k.kind == kind), CardKind(kind, self.name))
