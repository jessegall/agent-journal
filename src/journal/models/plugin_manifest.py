from dataclasses import dataclass, field

from journal.models.card_kind import CardKind
from journal.models.plugin_service import PluginService
from journal.models.requirement import Requirement
from journal.models.setup_step import SetupStep


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
    holds: tuple[str, ...] = ()
    """The events of those it hears that it may answer before the agent goes on."""
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
        return cls(**{**data, **{key: tuple(data[key]) for key in ("hears", "holds") if key in data},
                      "services": tuple(PluginService.from_json(s) for s in data.get("services", ())), "cards": tuple(CardKind.from_json(c) for c in data.get("cards", ())),
                      "setup": tuple(SetupStep.from_json(s) for s in data.get("setup", ())), "requires": {program: Requirement.from_json(r) for program, r in data.get("requires", {}).items()}})

    @property
    def programs(self) -> list[str]:
        """The files it runs from its folder: its program and each service's that lies there."""
        return [self.program, *(s.program for s in self.services if s.is_in_its_folder)]

    def card_kind(self, kind: str) -> CardKind:
        """The kind of card declared under that name; one not declared takes the plugin's name and the plug."""
        return next((k for k in self.cards if k.kind == kind), CardKind(kind, self.name))
