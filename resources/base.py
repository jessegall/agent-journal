import json
import re
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import ClassVar

TITLE_MAX = 80
ABSTRACT_MAX = 200
ACTIONS = ("created", "updated", "deleted", "linked", "commented", "completed")
SMALL, WIDE, DOCUMENT = "small", "wide", "document"
VIEWS = (SMALL, WIDE, DOCUMENT)
USER, AGENT, SYSTEM = "user", "agent", "system"
ENVIRONMENT, PROJECT = "environment", "project"
SCOPES = (ENVIRONMENT, PROJECT)
ACTORS = (USER, AGENT, SYSTEM)


@dataclass
class Event:
    id: int
    at: float
    type: str          # the resource type
    n: int
    action: str        # one of ACTIONS
    actor: str    # one of ACTORS
    data: dict = field(default_factory=dict)

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
    view: ClassVar[str] = SMALL  # how it is read: a small inspector, a wide one, or a document page
    nav: ClassVar[bool] = True   # whether it sits in the sidebar
    icon: ClassVar[str] = "dot"  # the viewer's glyph for it
    attention: ClassVar[bool] = False   # unread by the user, it waits on them
    handed: ClassVar[str] = ""          # its heading in the start block, empty when it is not handed to a session
    counted: ClassVar[bool] = False     # handed as a count, not row by row
    lent: ClassVar[bool] = True         # a subagent lent the environment may write it
    mirror: ClassVar[bool] = False      # it exists about another resource and is shown under it, never on its own
    scope: ClassVar[str] = ENVIRONMENT   # whose it is: one environment's, or the whole project's
    notify: ClassVar[tuple] = (USER, AGENT)   # who is told of its events, besides the actor
    spoken: ClassVar[bool] = False            # typed to the agent as its title, not as "type n action"
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

    def dump(self) -> str:
        head = {k: v for k, v in asdict(self).items() if k not in ("sections", "brief")}
        head["type"] = self.type
        out = ["---", json.dumps(head, indent=2), "---", self.brief.strip(), ""]
        for s in self.sections:
            out += [f"## {s['title']}", s["body"].strip(), ""]
        return "\n".join(out)

    @classmethod
    def load(cls, text: str) -> "Resource":
        _, head, body = text.split("---\n", 2)
        got = json.loads(head)
        got.pop("type", None)
        parts = re.split(r"^## (.+)$", body, flags=re.M)
        brief = parts[0].strip()
        sections = [{"title": parts[i].strip(), "body": parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]
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
    return " ".join((text or "").split()).replace(":", " -")[:TITLE_MAX].strip() or "untitled"


def check_abstract(abstract: str) -> str:
    flat = " ".join((abstract or "").split())
    if len(flat) > ABSTRACT_MAX:
        raise Refused(f"an abstract is at most {ABSTRACT_MAX} characters; this one is {len(flat)} — the rest goes in the brief")
    return flat
