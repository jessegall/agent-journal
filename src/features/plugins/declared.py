from dataclasses import dataclass, field

from engine.fields import list_of, mapping_of, number_of, text_of


def command_text(command) -> str:
    return command if isinstance(command, str) else " ".join(command)


@dataclass(frozen=True)
class Requirement:
    tool: str
    check: object
    hint: str

    @property
    def hint_text(self) -> str:
        return self.hint if self.hint else command_text(self.check)


@dataclass(frozen=True)
class Step:
    name: str
    run: object
    cwd: str


@dataclass(frozen=True)
class Service:
    name: str
    run: object
    cwd: str
    env: dict
    port: object
    ready_path: str
    restart: str
    grace: float
    show: dict

    @classmethod
    def from_payload(cls, name: str, raw: dict) -> "Service":
        return cls(name=name, run=raw["run"], cwd=text_of(raw, "cwd"), env=mapping_of(raw, "env"), port=raw.get("port"),
                   ready_path=text_of(mapping_of(raw, "ready"), "path"), restart=text_of(raw, "restart") if text_of(raw, "restart") else "on-failure",
                   grace=number_of(raw, "grace") if number_of(raw, "grace") else 5.0, show=mapping_of(raw, "show"))


@dataclass(frozen=True)
class Handler:
    pattern: str
    run: object = None
    post: str = ""

    @property
    def command(self) -> str:
        return self.post if self.post else command_text(self.run)


@dataclass(frozen=True)
class ChatRule:
    find: str
    replacement: str


@dataclass(frozen=True)
class Page:
    name: str
    title: str
    service: str
    path: str
    icon: str
    status: str


@dataclass(frozen=True)
class Setting:
    key: str
    title: str
    default: object
    env: str
    kind: str = "text"
    options: tuple = ()

    @property
    def summary(self) -> str:
        return f"reads {self.env}" if self.env else self.title if self.title else self.key


@dataclass(frozen=True)
class Card:
    label: str = ""
    icon: str = ""
    tone: str = ""
    color: str = ""

    @classmethod
    def from_json(cls, raw: dict) -> "Card | None":
        if not raw:
            return None
        return cls(text_of(raw, "label"), text_of(raw, "icon"), text_of(raw, "tone"), text_of(raw, "color"))


@dataclass(frozen=True)
class DeclaredEvent:
    name: str
    title: str
    tone: str
    card: Card | None


@dataclass(frozen=True)
class Manifest:
    stored: dict
    name: str
    version: str = ""
    title: str = ""
    description: str = ""
    requires: tuple = ()
    env: dict = field(default_factory=dict)
    setup: tuple = ()
    services: tuple = ()
    handlers: tuple = ()
    refuse: object = None
    reads: bool = False
    refuse_seconds: float = 0.0
    refuse_socket: str = ""
    chat: tuple = ()
    pages: tuple = ()
    settings: tuple = ()
    skills: str = ""
    installed: str = ""
    events: tuple = ()
    cancels: dict = field(default_factory=dict)

    @classmethod
    def of(cls, raw) -> "Manifest":
        raw = raw if isinstance(raw, dict) else {}
        handlers = mapping_of(raw, "on")
        return cls(
            stored=raw, name=text_of(raw, "name"), version=text_of(raw, "version"), title=text_of(raw, "title"), description=text_of(raw, "description"),
            requires=tuple(Requirement(tool, wanted["check"], text_of(wanted, "hint")) for tool, wanted in mapping_of(raw, "requires").items()),
            env=mapping_of(raw, "env"),
            setup=tuple(Step(text_of(step, "name"), step["run"], text_of(step, "cwd")) for step in list_of(raw, "setup")),
            services=tuple(Service.from_payload(name, given) for name, given in mapping_of(raw, "services").items()),
            handlers=tuple(Handler(pattern, given.get("run"), text_of(given, "post")) for pattern, given in handlers.items()),
            refuse=raw.get("refuse"), reads=bool(raw.get("reads")), refuse_seconds=number_of(raw, "refuse_seconds"),
            refuse_socket=text_of(raw, "refuse_socket"),
            chat=tuple(ChatRule(rule["find"], rule["as"]) for rule in list_of(raw, "chat")),
            pages=tuple(Page(page["name"], page["title"], page["service"], page["path"], text_of(page, "icon"), text_of(page, "status")) for page in list_of(raw, "pages")),
            settings=tuple(Setting(key, text_of(given, "title"), given.get("default", ""), text_of(given, "env"), text_of(given, "type") if text_of(given, "type") else "text",
                                   tuple(list_of(given, "options"))) for key, given in mapping_of(raw, "settings").items()),
            skills=text_of(raw, "skills"), installed=text_of(raw, "installed"),
            events=tuple(DeclaredEvent(name, text_of(given, "title"), text_of(given, "tone"), Card.from_json(mapping_of(given, "card")))
                         for name, given in mapping_of(raw, "events").items()),
            cancels=mapping_of(raw, "cancels"))

    @property
    def heading(self) -> str:
        return self.title if self.title else self.name

    def event(self, name: str) -> DeclaredEvent | None:
        return next((event for event in self.events if event.name == name), None)

    def setting(self, key: str) -> Setting | None:
        return next((setting for setting in self.settings if setting.key == key), None)

    def listening(self, known) -> list[Handler]:
        return [handler for handler in self.handlers if handler.pattern in known]


def declared(row) -> Manifest:
    return Manifest.of(row.manifest)


@dataclass(frozen=True)
class PluginSettings:
    ports: dict = field(default_factory=dict)
    chosen: dict = field(default_factory=dict)
    kept: dict = field(default_factory=dict)

    @classmethod
    def from_json(cls, raw) -> "PluginSettings":
        raw = raw if isinstance(raw, dict) else {}
        return cls(mapping_of(raw, "ports"), mapping_of(raw, "chosen"), raw)

    def to_json(self) -> dict:
        return {**self.kept, "ports": self.ports, "chosen": self.chosen}


def settings_of(row) -> PluginSettings:
    return PluginSettings.from_json(row.settings)
