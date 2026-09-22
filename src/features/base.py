import re
from abc import ABC
from functools import cached_property
from typing import ClassVar

from controllers.types import Agents, Features
from features import trigger
from features.trigger import NEVER, Trigger
from engine.hooks import gate_file
from features.journal import Journal
from features.settings import Setting, Settings
from engine.text import paragraphs
from resources.base import Refused, SYSTEM
from engine.stored import read_json, write_json
from engine.wording import plural

REGISTRY: dict[str, type] = {}


def held(record, session: str) -> str:
    holds = read_json(gate_file(record.root, record.env, session), {})
    return "; ".join(why for why in holds.values() if why)


class Behaviour:
    def __init__(self, title: str, abstract: str = "", default: bool = True, trigger: Trigger = NEVER, name: str = ""):
        self.name, self.title, self.abstract, self.default, self.trigger = name, paragraphs(title), paragraphs(abstract), default, trigger

    def describe(self) -> dict:
        return {"title": self.title, "abstract": self.abstract, "default": self.default, "trigger": self.trigger.spec()}


PLACEHOLDER = re.compile(r"\{\{(\w+)\}\}")


class Line:
    def __init__(self, title: str, brief: str = "", lead: bool = False, name: str = "", while_waiting: bool | None = None):
        self.name, self.title, self.brief, self.lead = name, paragraphs(title), paragraphs(brief), lead
        self.while_waiting = while_waiting   # whether it is still said while the agent waits; None takes the feature's answer

    def placeholders(self) -> list[str]:
        return list(dict.fromkeys(PLACEHOLDER.findall(self.title + self.brief)))

    def filled(self, values: dict) -> tuple[str, str]:
        wanted = set(self.placeholders())
        if wanted != set(values):
            raise Refused(f"the line {self.title!r} takes {sorted(wanted)}, given {sorted(values)}")
        fill = lambda text: PLACEHOLDER.sub(lambda found: str(values[found.group(1)]), text)
        return fill(self.title), fill(self.brief)

    def describe(self) -> dict:
        return {"title": self.title, "brief": self.brief, "placeholders": self.placeholders()}


SWITCHES: dict[str, dict] = {}
GENERATION = [0]


def booted(record) -> dict[str, bool]:
    SWITCHES[str(record.home)] = {row.title: bool(row.enabled) for row in Features(record, actor=SYSTEM)._every() if not row.deleted}
    return SWITCHES[str(record.home)]


def switches(record) -> dict[str, bool]:
    return SWITCHES.get(str(record.home)) or booted(record)


def rebooted(event=None, record=None) -> None:
    GENERATION[0] += 1
    if record is None:
        SWITCHES.clear()
    else:
        booted(record)


def generation() -> int:
    return GENERATION[0]


class FeatureDetails:
    name: ClassVar[str] = ""
    title: ClassVar[str] = ""
    abstract: ClassVar[str] = ""
    help: ClassVar[str] = ""
    lines: ClassVar[list[Line]] = []
    behaviours: ClassVar[list[Behaviour]] = []
    settings: ClassVar[list[Setting]] = []
    trigger: ClassVar[Trigger] = NEVER
    aliases: ClassVar[tuple] = ()
    keywords: ClassVar[tuple] = ()     # words that make the agent load this feature's skill
    when: ClassVar[str] = ""   # when the agent should load its skill; empty for a feature that runs by itself
    speaks_while_waiting: ClassVar[bool] = False   # whether its lines still reach an agent that declared a wait
    runs_for_subagents: ClassVar[bool] = False
    fixed: ClassVar[bool] = False
    primary: ClassVar[bool] = False
    default: ClassVar[bool] = True

    @classmethod
    def values(cls, record) -> Settings:
        return Settings(cls.settings, record.setting(cls.name, {}))


class Feature(ABC):
    details: ClassVar[type[FeatureDetails] | None] = None
    name: ClassVar[str] = ""
    title: ClassVar[str] = ""
    abstract: ClassVar[str] = ""
    help: ClassVar[str] = ""
    trigger: ClassVar[Trigger] = NEVER
    behaviours: ClassVar[dict] = {}
    lines: ClassVar[dict[str, Line]] = {}
    settings: ClassVar[list[Setting]] = []
    aliases: ClassVar[tuple] = ()      # names this feature used to have; a pair says the old feature is now one of its behaviours
    keywords: ClassVar[tuple] = ()     # words that make the agent load this feature's skill
    when: ClassVar[str] = ""
    speaks_while_waiting: ClassVar[bool] = False
    runs_for_subagents: ClassVar[bool] = False
    default: ClassVar[bool] = True
    fixed: ClassVar[bool] = False

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        if cls.details:
            d = cls.details
            cls.name, cls.lines, cls.behaviours, cls.settings, cls.trigger = d.name, {line.name: line for line in d.lines}, {b.name: b for b in d.behaviours}, d.settings, d.trigger
            cls.title, cls.abstract, cls.help, cls.when = paragraphs(d.title), paragraphs(d.abstract), paragraphs(d.help), d.when
            cls.aliases, cls.runs_for_subagents, cls.fixed, cls.default = d.aliases, d.runs_for_subagents, d.fixed, d.default
            named = d.name.split("_") + [a for a in d.aliases if isinstance(a, str)]
            cls.speaks_while_waiting = d.speaks_while_waiting
            for line in cls.lines.values():
                line.while_waiting = d.speaks_while_waiting if line.while_waiting is None else line.while_waiting
            cls.keywords = d.keywords or tuple(dict.fromkeys(w for word in named for w in (word, word[:-1] if word.endswith("s") else f"{word}s")))
        if cls.name:
            REGISTRY[cls.name] = cls

    def register(self, journal: Journal) -> None:
        pass

    def wire(self) -> None:
        self.register(self.journal)

    @classmethod
    def default_for(cls, root) -> bool:
        return cls.default

    @classmethod
    def on_for(cls, record) -> bool:
        if cls.fixed:
            return True
        found = switches(record)
        return found[cls.name] if cls.name in found else record.features.get(cls.name, cls.default_for(record.root))

    def enabled(self, record) -> bool:
        return self.on_for(record)

    def enable(self, record) -> None:
        Features(record, actor=SYSTEM).switch(self.name, True)

    def disable(self, record) -> None:
        Features(record, actor=SYSTEM).switch(self.name, False)

    def agent(self, event, record):
        return Agents(record, actor=SYSTEM).load(event.n)

    def agent_due(self, event, record):
        agent = self.agent(event, record)
        return agent if self.due(record, agent) else None

    def standing(self, record, controller: type) -> list:
        return controller(record, actor=SYSTEM)._standing()

    def keyed(self, key: str = "") -> str:
        return f"{self.name}.{key}" if key else self.name

    def on(self, record, key: str = "") -> bool:
        if not self.enabled(record):
            return False
        return self.chosen(record, key) if key else True

    def chosen(self, record, key: str) -> bool:
        return bool(record.features.get(self.keyed(key), self.behaviours[key].default))

    def cadence(self, record, key: str = "") -> dict:
        return self.behaviours[key].trigger if key else self.trigger

    def due(self, record, agent, key: str = "") -> bool:
        spec = self.cadence(record, key)
        if not self.on(record, key) or not spec or not trigger.due(record, agent, self.keyed(key), spec):
            return False
        trigger.fired(record, agent, self.keyed(key))
        return True

    def mine(self, agent) -> bool:
        return self.runs_for_subagents or not agent.subagent

    def settings_view(self, record) -> dict | None:
        return dict(self.values(record)) if self.settings else None

    def values(self, record) -> Settings:
        return Settings(self.settings, record.setting(self.name, {}))

    def setting(self, record, key: str, default=None):
        return record.setting(self.name, {}).get(key, default)

    def live(self, record) -> list:
        return [agent for agent in Agents(record, actor=SYSTEM)._standing() if self.mine(agent)]

    def line(self, name: str, values: dict) -> tuple[str, str]:
        if name not in self.lines:
            raise Refused(f"the {self.name} feature has no line named {name!r}")
        return self.lines[name].filled(values)

    def hold(self, record, line: str, key: str = "", agent=None, **values) -> None:
        self._gate(record, self.line(line, values)[0], key, agent)

    def _gate(self, record, why: str, key: str, agent) -> None:
        for agent in [agent] if agent else self.live(record):
            f = gate_file(record.root, record.env, agent.title)
            held = read_json(f, {})
            if held.get(self.keyed(key), "") != why:
                write_json(f, {**held, self.keyed(key): why})

    def release(self, record, key: str = "", agent=None) -> None:
        self._gate(record, "", key, agent)

    @cached_property
    def journal(self) -> Journal:
        return Journal(self)

    def plural(self, n: int, word: str) -> str:
        return plural(n, word)

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title, "abstract": self.abstract, "help": self.help, "default": self.default, "fixed": self.fixed,
                "keywords": list(self.keywords), "when": self.when,
                "listens": sorted(set(self.journal.events.names)), "trigger": self.trigger.spec(),
                "behaviours": {key: b.describe() for key, b in self.behaviours.items()},
                "lines": {key: line.describe() for key, line in self.lines.items()},
                "settings": [s.describe() for s in self.settings]}
