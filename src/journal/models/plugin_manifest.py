from dataclasses import dataclass, field


@dataclass(frozen=True)
class PluginManifest:
    """What a plugin's journal-plugin.json says it is, runs, hears and holds, as read and checked."""

    name: str
    version: str
    program: str
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
    services: tuple[dict, ...] = ()
    """Processes kept running beside it: each a name, a command, a restart policy and an optional when test."""
    settings: str = ""
    """A path to its settings schema file."""
    skills: str = ""
    """A folder of its skills."""
    cards: tuple[dict, ...] = ()
    """The kinds of card it shows, each a kind, a label and a tone."""
    requires: dict = field(default_factory=dict)
    """Each program it needs, with the shell check that it is there and a hint for when it is not."""
    setup: tuple[dict, ...] = ()
    """Steps run in order at install in its folder, each a name and a shell line to run."""
    installed: str = ""
    """A command run after the setup, whose JSON answer fills its settings."""
    dashboard: dict = field(default_factory=dict)
