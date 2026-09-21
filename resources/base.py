import json
import re
from dataclasses import dataclass, field, asdict, replace
from types import SimpleNamespace
from typing import ClassVar

TITLE_MAX = 80
ABSTRACT_MAX = 200
ACTIONS = ("created", "updated", "deleted", "linked", "commented", "completed", "reopened")
SMALL, WIDE, DOCUMENT = "small", "wide", "document"
VIEWS = (SMALL, WIDE, DOCUMENT)
USER, AGENT, SYSTEM, PLUGIN = "user", "agent", "system", "plugin"
OPEN, CLOSED, EVERY = "open", "closed", "every"
OPENED, COMPLETED, CLEARED = "opened", "completed", "cleared"
CLEARINGS = (OPENED, COMPLETED, CLEARED)
WHOM = "whom"
KEYWORDS = "keywords"
ENVIRONMENT, PROJECT = "environment", "project"
SCOPES = (ENVIRONMENT, PROJECT)
LAZY, EAGER, MEMORY = "lazy", "eager", "memory"
ACTORS = (USER, AGENT, SYSTEM, PLUGIN)


def names(*columns: str) -> SimpleNamespace:
    return SimpleNamespace(**{c: c for c in columns})


class Field:
    def __init__(self, spec=None, default=None):
        self.spec, self.default = spec, default

    def __set_name__(self, owner, name: str) -> None:
        self.name = name

    def __get__(self, obj, owner=None):
        if obj is None:
            return self.name
        if self.name in obj.data:
            return obj.data[self.name]
        return obj.data.setdefault(self.name, self.default()) if callable(self.default) else self.default

    def __set__(self, obj, value) -> None:
        obj.data[self.name] = value


SECTION = names("title", "body")


def copied(value):
    if isinstance(value, dict):
        return {k: copied(v) for k, v in value.items()}
    if isinstance(value, list):
        return [copied(v) for v in value]
    return value


def shown(r) -> dict:
    return {**asdict(r), "type": r.type, "ref": r.ref}


@dataclass
class Event:
    id: int
    at: float
    type: str          # the resource type
    n: int
    action: str        # one of ACTIONS
    actor: str    # one of ACTORS
    data: dict = field(default_factory=dict)
    pid: int = 0
    heard: bool = False

    @property
    def ref(self) -> str:
        return f"{self.type}:{self.n}"


@dataclass
class Resource:
    type = ""              # the type's name; its title, abstract and help are the type's own words
    title_ = ""
    abstract_ = ""
    help_ = ""
    names: ClassVar[dict] = {}   # what this type calls a controller method: {"complete": "done", "create": "add"}
    says: ClassVar[dict] = {}    # how the bar says a command on it: {"complete": "answering"}
    shown: ClassVar[dict] = {}   # how an event on it reads in the viewer: {"created": "Work started"}
    view: ClassVar[str] = SMALL  # how it is read: a small inspector, a wide one, or a document page
    nav: ClassVar[bool] = True   # whether it sits in the sidebar
    icon: ClassVar[str] = "dot"  # the viewer's glyph for it
    attention: ClassVar[bool] = False   # unread by the user, it waits on them
    clears: ClassVar[str] = CLEARED     # what takes it off the user's list: opening it, completing it, or the user clearing it
    filters: ClassVar[tuple] = (OPEN, CLOSED)   # the ways its list can be narrowed, shown as the tabs above it
    handed: ClassVar[str] = ""          # its heading in the start block, empty when it is not handed to a session
    counted: ClassVar[bool] = False     # handed as a count, not row by row
    lent: ClassVar[bool] = True         # a subagent lent the environment may write it
    mirror: ClassVar[bool] = False      # it exists about another resource and is shown under it, never on its own
    closed_first: ClassVar[bool] = False
    scope: ClassVar[str] = ENVIRONMENT   # whose it is: one environment's, or the whole project's
    notify: ClassVar[tuple] = (USER, AGENT)   # who is told of its events, besides the actor
    spoken: ClassVar[bool] = False            # typed to the agent as its title, not as "type n action"
    urgent_actions: ClassVar[tuple] = ()      # the actions delivered on their own line, at once, never held for the batch
    notify_actions: ClassVar[tuple] = ()      # besides everything the user does, the system actions the agent is notified of
    answered: ClassVar[str] = "comment"      # the word that answers a row instead of changing it
    editors: ClassVar[dict] = {}              # who may change the words of a row written by whom: {USER: (USER,)}; unnamed authors are open to all
    told: ClassVar[bool] = False              # the row is stamped with the moment the agent was told of it
    said_twice: ClassVar[bool] = False       # the same words from the same actor within seconds return the first row instead of a second
    indexed: ClassVar[tuple] = ()             # data fields kept in the in-memory index, for lookups that load no row
    loading: ClassVar[str] = MEMORY           # lazy: indexed on first use; eager: indexed at boot; memory: indexed at boot, every row held
    files = Field(default=dict)               # what is attached: name → what became of it
    pictures = Field(default=dict)            # an attached image's width and height, known before it loads
    agent = Field()                           # the subagent that wrote it, and its dispatcher
    dispatcher = Field()
    n: int = 0
    title: str = ""
    abstract: str = ""
    brief: str = ""
    sections: list = field(default_factory=list)   # [{"title": str, "body": str}]
    refs: list = field(default_factory=list)       # ["type:n"]
    seen: list = field(default_factory=list)       # the actors who have seen it: USER, AGENT
    data: dict = field(default_factory=dict)       # what a type adds: status, answer, phases …
    created: float = 0.0
    updated: float = 0.0
    deleted: float = 0.0
    completed: float = 0.0
    outcome: str = ""      # what completing it said: how a to-do was done, a question's answer, why a pin was struck

    @property
    def ref(self) -> str:
        return f"{self.type}:{self.n}"

    def fork(self) -> "Resource":
        return replace(self, sections=[dict(s) for s in self.sections], refs=list(self.refs), seen=list(self.seen), data=copied(self.data))

    def dump(self) -> str:
        head = {k: v for k, v in asdict(self).items() if k not in ("sections", "brief")}
        head["type"] = self.type
        out = ["---", json.dumps(head, indent=2), "---", self.brief.strip(), ""]
        for s in self.sections:
            out += [f"## {s[SECTION.title]}", s[SECTION.body].strip(), ""]
        return "\n".join(out)

    @classmethod
    def load(cls, text: str) -> "Resource":
        _, head, body = text.split("---\n", 2)
        got = json.loads(head)
        got.pop("type", None)
        parts = re.split(r"^## (.+)$", body, flags=re.M)
        brief = parts[0].strip()
        sections = [{SECTION.title: parts[i].strip(), SECTION.body: parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]
        return cls(brief=brief, sections=sections, **got)


class Refused(Exception):
    pass


def check_title(title: str) -> str:
    flat = " ".join((title or "").split())
    if not flat:
        raise Refused("a title is required")
    if len(flat) > TITLE_MAX:
        raise Refused(f"a title is at most {TITLE_MAX} characters; this one is {len(flat)} — the rest goes in the brief")
    if ":" in flat:
        raise Refused("a title names the thing; it does not explain it with a colon — that goes in the brief")
    return flat


def titled(text: str) -> str:
    lines = (text or "").splitlines()
    line = " ".join(next((l for l in lines if l.strip() and not l.startswith(">")), text or "").split()).replace(":", " -")
    if len(line) <= TITLE_MAX:
        return line or "untitled"
    cut = line[:TITLE_MAX - 1]
    return f"{(cut[:cut.rindex(' ')] if ' ' in cut else cut).rstrip(' -,.;')}…"


def check_abstract(abstract: str) -> str:
    flat = " ".join((abstract or "").split())
    if len(flat) > ABSTRACT_MAX:
        raise Refused(f"an abstract is at most {ABSTRACT_MAX} characters; this one is {len(flat)} — the rest goes in the brief")
    return flat
