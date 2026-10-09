from dataclasses import dataclass, field, replace
from fnmatch import fnmatch
from pathlib import PurePath

from resources.fields import Loaded
from resources.base import Refused

REFUSE_SECONDS = 1.5
LONGEST_REFUSE = 3.0


def command_text(command) -> str:
    return command if isinstance(command, str) else " ".join(command)


def shell_args(command) -> list[str]:
    return ["/bin/sh", "-c", command] if isinstance(command, str) else list(command)


@dataclass(frozen=True)
class Requirement(Loaded):
    keyed_by = "tool"
    tool: str
    check: object
    hint: str = ""

    @property
    def hint_text(self) -> str:
        return self.hint if self.hint else command_text(self.check)


@dataclass(frozen=True)
class Step(Loaded):
    run: object
    name: str = ""
    cwd: str = ""


@dataclass(frozen=True)
class Ready(Loaded):
    path: str = ""


@dataclass(frozen=True)
class Service(Loaded):
    keyed_by = "name"
    name: str
    run: object
    cwd: str = ""
    env: dict = field(default_factory=dict)
    port: object = None
    ready: Ready = Ready()
    restart: str = "on-failure"
    grace: float = 5.0
    show: dict = field(default_factory=dict)
    when: str = ""


@dataclass(frozen=True)
class Handler(Loaded):
    keyed_by = "pattern"
    pattern: str
    run: object = None
    post: str = ""

    @property
    def command(self) -> str:
        return self.post if self.post else command_text(self.run)


@dataclass(frozen=True)
class ChatRule(Loaded):
    aliases = {"replacement": ("as",)}
    find: str
    replacement: str


@dataclass(frozen=True)
class Dashboard(Loaded):
    name: str
    title: str
    icon: str = ""


@dataclass(frozen=True)
class Page(Loaded):
    name: str
    title: str
    service: str
    path: str
    icon: str = ""
    status: str = ""


@dataclass(frozen=True)
class Setting(Loaded):
    keyed_by = "key"
    aliases = {"kind": ("type",)}
    key: str
    title: str = ""
    default: object = ""
    env: str = ""
    kind: str = "text"
    options: tuple = ()

    @property
    def summary(self) -> str:
        if self.env:
            return f"reads {self.env}"
        return self.title if self.title else self.key

    @property
    def is_command(self) -> bool:
        return self.kind == "command"

    def is_secret(self) -> bool:
        return self.kind == "secret"

    def check(self, value: str) -> None:
        if self.kind == "flag" and value not in ("true", "false"):
            raise Refused(f"{self.key} is a switch: true or false")
        if self.kind == "number" and not value.lstrip("-").replace(".", "", 1).isdigit():
            raise Refused(f"{self.key} is a number, not {value!r}")
        if self.kind == "options" and value not in [str(option) for option in self.options]:
            raise Refused(f"{self.key} is one of {', '.join(map(str, self.options))}")


@dataclass(frozen=True)
class Look:
    label: str
    icon: str
    tone: str
    color: str


@dataclass(frozen=True)
class Card(Loaded):
    label: str = ""
    icon: str = ""
    tone: str = ""
    color: str = ""
    collapsed: bool = False


@dataclass(frozen=True)
class DeclaredEvent(Loaded):
    keyed_by = "name"
    name: str
    title: str = ""
    tone: str = ""
    card: Card | None = None

    @property
    def collapsed(self) -> bool:
        return self.card is not None and self.card.collapsed

    @property
    def shown_title(self) -> str:
        return self.title if self.title else self.name

    def look(self) -> Look:
        card = self.card if self.card is not None else Card()
        return Look(card.label if card.label else self.shown_title, card.icon, card.tone if card.tone else self.tone, card.color)


@dataclass(frozen=True)
class Fits(Loaded):
    languages: tuple[str, ...] = ()
    files: tuple[str, ...] = ()

    def found(self, languages: set[str], names: list[str]) -> list[str]:
        files = {PurePath(name).name for name in names}
        return [*sorted(languages.intersection(self.languages)), *sorted(name for name in files if any(fnmatch(name, pattern) for pattern in self.files))]


SYNC, ASYNC = "sync", "async"
GUARDED = "PreToolUse"


@dataclass(frozen=True)
class Manifest(Loaded):
    aliases = {"handlers": ("on",)}
    stored: dict = field(default_factory=dict)
    name: str = ""
    version: str = ""
    title: str = ""
    description: str = ""
    requires: tuple[Requirement, ...] = ()
    env: dict = field(default_factory=dict)
    setup: tuple[Step, ...] = ()
    services: tuple[Service, ...] = ()
    handlers: tuple[Handler, ...] = ()
    refuse: object = None
    hooks: dict = field(default_factory=dict)
    reads: bool = False
    refuse_seconds: float = 0.0
    refuse_socket: str = ""
    chat: tuple[ChatRule, ...] = ()
    pages: tuple[Page, ...] = ()
    dashboards: tuple[Dashboard, ...] = ()
    settings: tuple[Setting, ...] = ()
    skills: str = ""
    command: str = ""
    installed: str = ""
    events: tuple[DeclaredEvent, ...] = ()
    cancels: dict = field(default_factory=dict)
    load: dict = field(default_factory=dict)
    fits: Fits = field(default_factory=Fits)

    @classmethod
    def of(cls, raw) -> "Manifest":
        given = raw if isinstance(raw, dict) else {}
        return replace(cls.from_json(given), stored=given)

    @property
    def heading(self) -> str:
        return self.title if self.title else self.name

    def waits(self, event: str) -> bool:
        """Whether the agent's tool call waits for the plugin's answer to this hook: only a hook declared sync, or the refusal a plugin gives before a tool call unless it says async."""
        how = self.hooks.get(event)
        return how == SYNC if how else event == GUARDED and bool(self.refuse)

    @property
    def refuse_budget(self) -> float:
        return min(self.refuse_seconds if self.refuse_seconds else REFUSE_SECONDS, LONGEST_REFUSE)

    def event(self, name: str) -> DeclaredEvent | None:
        return next((event for event in self.events if event.name == name), None)

    def setting(self, key: str) -> Setting | None:
        return next((setting for setting in self.settings if setting.key == key), None)

    def skills_for(self, known) -> list[str]:
        return list(dict.fromkeys(skill for pattern in known if pattern in self.load for skill in self.load[pattern]))

    def listening(self, known) -> list[Handler]:
        return [handler for handler in self.handlers if handler.pattern in known]


MANIFESTS: dict[tuple, Manifest] = {}


def declared(row) -> Manifest:
    key = (row.title, row.n, row.updated)
    if key not in MANIFESTS:
        MANIFESTS[key] = Manifest.of(row.manifest)
    return MANIFESTS[key]


def called(row) -> str:
    return declared(row).name


def named(plugins, name: str):
    return next((row for row in plugins.rows.standing() if called(row) == name), None)


def removed(plugins, name: str):
    """The newest row of a plugin of this name that was removed, which installing it again brings back."""
    return next((row for row in reversed(plugins.rows.every()) if row.completed and called(row) == name), None)


@dataclass(frozen=True)
class PluginSettings(Loaded):
    ports: dict = field(default_factory=dict)
    chosen: dict = field(default_factory=dict)
    kept: dict = field(default_factory=dict)

    @classmethod
    def of(cls, raw) -> "PluginSettings":
        given = raw if isinstance(raw, dict) else {}
        return replace(cls.from_json(given), kept=given)

    def to_json(self) -> dict:
        return {**self.kept, "ports": self.ports, "chosen": self.chosen}


def settings_of(row) -> PluginSettings:
    return PluginSettings.of(row.settings)


def settings_choosing(row, values: dict) -> dict:
    return settings_with(row, chosen={**settings_of(row).chosen, **values})


def settings_with(row, **changes) -> dict:
    return replace(settings_of(row), **changes).to_json()
