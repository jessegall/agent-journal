from dataclasses import dataclass, field, replace

from engine.fields import Loaded


def command_text(command) -> str:
    return command if isinstance(command, str) else " ".join(command)


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
    reads: bool = False
    refuse_seconds: float = 0.0
    refuse_socket: str = ""
    chat: tuple[ChatRule, ...] = ()
    pages: tuple[Page, ...] = ()
    dashboards: tuple[Dashboard, ...] = ()
    settings: tuple[Setting, ...] = ()
    skills: str = ""
    installed: str = ""
    events: tuple[DeclaredEvent, ...] = ()
    cancels: dict = field(default_factory=dict)
    load: dict = field(default_factory=dict)

    @classmethod
    def of(cls, raw) -> "Manifest":
        given = raw if isinstance(raw, dict) else {}
        return replace(cls.from_json(given), stored=given)

    @property
    def heading(self) -> str:
        return self.title if self.title else self.name

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
