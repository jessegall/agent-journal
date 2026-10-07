import re
from abc import ABC
from dataclasses import asdict
from functools import cached_property
from typing import ClassVar

from controllers.features import SETTING_KEYS
from controllers.types import Agents
from features import trigger
from features.switches import switches
from features.trigger import MINUTE, NEVER, Trigger
from engine.gates import Hold, hold
from engine.reach import Reach, Unreached
from features.groups import Group
from features.journal import Journal
from features.settings import Setting, Settings
from resources.text import paragraphs
from resources.base import Refused, SYSTEM

REGISTRY: dict[str, type] = {}


class Behaviour:
    def __init__(self, title: str, abstract: str = "", default: bool = True, trigger: Trigger = NEVER, name: str = "",
                 prefix: str = ""):
        self.name, self.title, self.abstract, self.default, self.trigger = name, paragraphs(title), paragraphs(abstract), default, trigger
        self.prefix = prefix

    def describe(self) -> dict:
        return {"title": self.title, "abstract": self.abstract, "default": self.default, "trigger": self.trigger.described(),
                "prefix": self.prefix}


PLACEHOLDER = re.compile(r"\{\{(\w+)\}\}")


class Line:
    def __init__(self, title: str, brief: str = "", lead: bool = False, name: str = "", while_waiting: bool | None = None, label: str = "",
                 reach: Reach = Reach.MAIN, reply_kept: bool = False, until: tuple[str, ...] = ()):
        self.name, self.title, self.brief, self.lead, self.label, self.reach = name, paragraphs(title), paragraphs(brief), lead, label, reach
        self.reply_kept, self.until = reply_kept, until
        self.while_waiting = while_waiting

    def placeholders(self) -> list[str]:
        return list(dict.fromkeys(PLACEHOLDER.findall(self.title + self.brief)))

    def filled(self, values: dict) -> tuple[str, str]:
        wanted = set(self.placeholders())
        if wanted != set(values):
            raise Refused(f"the line {self.title!r} takes {sorted(wanted)}, given {sorted(values)}")
        fill = lambda text: PLACEHOLDER.sub(lambda found: str(values[found.group(1)]), text)
        return fill(self.title), fill(self.brief)

    def asking(self, feature: str) -> dict:
        return {"until": list(self.until), "asks": f"{feature}.{self.name}"} if self.until else {}

    def describe(self) -> dict:
        return {"title": self.title, "brief": self.brief, "placeholders": self.placeholders(), "reach": self.reach}


class FeatureDetails:
    name: ClassVar[str] = ""
    title: ClassVar[str] = ""
    abstract: ClassVar[str] = ""
    help: ClassVar[str] = ""
    explains: ClassVar[str] = ""
    label: ClassVar[str] = ""
    hint: ClassVar[str] = ""
    position: ClassVar[int] = 100
    group: ClassVar[Group]
    trigger_label: ClassVar[str] = ""
    lines: ClassVar[list[Line]] = []
    behaviours: ClassVar[list[Behaviour]] = []
    settings: ClassVar[list[Setting]] = []
    trigger: ClassVar[Trigger] = NEVER
    aliases: ClassVar[tuple] = ()
    keywords: ClassVar[tuple] = ()
    when: ClassVar[str] = ""
    speaks_while_waiting: ClassVar[bool] = False
    fixed: ClassVar[bool] = False
    primary: ClassVar[bool] = False
    has_skill: ClassVar[bool] = True
    skill_of: ClassVar[str] = ""
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
    explains: ClassVar[str] = ""
    label: ClassVar[str] = ""
    hint: ClassVar[str] = ""
    position: ClassVar[int] = 100
    group: ClassVar[Group] = Group.DEVELOPER
    trigger_label: ClassVar[str] = ""
    trigger: ClassVar[Trigger] = NEVER
    behaviours: ClassVar[dict] = {}
    lines: ClassVar[dict[str, Line]] = {}
    settings: ClassVar[list[Setting]] = []
    aliases: ClassVar[tuple] = ()
    keywords: ClassVar[tuple] = ()
    when: ClassVar[str] = ""
    speaks_while_waiting: ClassVar[bool] = False
    default: ClassVar[bool] = True
    fixed: ClassVar[bool] = False
    nudges: ClassVar[tuple] = ()
    sequences: ClassVar[tuple] = ()

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        if cls.details:
            d = cls.details
            cls.name, cls.lines, cls.behaviours, cls.settings, cls.trigger = d.name, {line.name: line for line in d.lines}, {b.name: b for b in d.behaviours}, d.settings, d.trigger
            cls.title, cls.abstract, cls.help, cls.explains, cls.when = paragraphs(d.title), paragraphs(d.abstract), paragraphs(d.help), paragraphs(d.explains), d.when
            cls.label, cls.hint, cls.group, cls.trigger_label = paragraphs(d.label), paragraphs(d.hint), d.group, paragraphs(d.trigger_label)
            cls.position = d.position
            cls.aliases, cls.fixed, cls.default = d.aliases, d.fixed, d.default
            named = d.name.split("_") + [a for a in d.aliases if isinstance(a, str)]
            cls.speaks_while_waiting = d.speaks_while_waiting
            for line in cls.lines.values():
                line.while_waiting = d.speaks_while_waiting if line.while_waiting is None else line.while_waiting
                if not isinstance(line.reach, Reach):
                    raise Unreached(f"the {d.name} line {line.name!r}")
            cls.keywords = d.keywords or tuple(dict.fromkeys(w for word in named for w in (word, word[:-1] if word.endswith("s") else f"{word}s")))
        if cls.name:
            REGISTRY[cls.name] = cls

    def register(self, journal: Journal) -> None:
        pass

    def wire(self) -> None:
        self.register(self.journal)
        if self.settings:
            SETTING_KEYS.add(None, tuple(self.settings), key=self.name)
        if self.nudges:
            from features.nudges import SendOnTheClock, SendOnToolUse
            self.journal.events.handler(SendOnTheClock(self.nudges))
            self.journal.events.handler(SendOnToolUse(self.nudges))

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

    def standing(self, record, controller: type) -> list:
        return controller(record, actor=SYSTEM).rows.standing()

    def keyed(self, key: str = "") -> str:
        return f"{self.name}.{key}" if key else self.name

    def on(self, record, key: str = "") -> bool:
        if not self.enabled(record):
            return False
        return self.chosen(record, key) if key else True

    def chosen(self, record, key: str) -> bool:
        return bool(record.features.get(self.keyed(key), self.behaviours[key].default))

    def choose(self, record, key: str, on: bool) -> None:
        record.set_setting("features", {**record.setting("features", {}), self.keyed(key): bool(on)})

    def cadence(self, record, key: str = "") -> Trigger:
        return trigger.saved(record, self.keyed(key), self.behaviours[key].trigger if key else self.trigger)

    def interval(self, record, key: str = "") -> float:
        return float(self.cadence(record, key).every) * MINUTE

    def due(self, record, agent, key: str = "") -> bool:
        cadence = self.cadence(record, key)
        if not self.on(record, key) or not cadence or not trigger.due(record, agent, self.keyed(key), cadence):
            return False
        trigger.fired(record, agent, self.keyed(key))
        return True

    def settings_view(self, record) -> dict | None:
        return dict(self.values(record)) if self.settings else None

    def values(self, record) -> Settings:
        return self.details.values(record)

    def reached(self, record, reach: Reach) -> list:
        return [agent for agent in Agents(record, actor=SYSTEM).rows.standing() if reach.reaches(agent.subagent)]

    def declared_line(self, name: str) -> Line:
        if name not in self.lines:
            raise Refused(f"the {self.name} feature has no line named {name!r}")
        return self.lines[name]

    def line(self, name: str, values: dict) -> tuple[str, str]:
        return self.declared_line(name).filled(values)

    def line_text(self, name: str, **values) -> str:
        return " - ".join(self.line(name, values))

    def settings_changed(self, record, actor: str) -> None:
        return None

    def to_primary(self, record, line: str, actor: str = SYSTEM, **values) -> None:
        agent = Agents(record, actor=SYSTEM).primary()
        if agent:
            self.journal.say(record, agent, line, actor=actor, **values)

    def hold(self, record, line: str, key: str = "", agent=None, **values) -> None:
        self._gate(record, Hold(self.line(line, values)[0], self.lines[line].reach), key, agent)

    def _gate(self, record, given: Hold, key: str, agent) -> None:
        for row in [agent] if agent else Agents(record, actor=SYSTEM).rows.standing():
            if given.reach.reaches(row.subagent):
                hold(record.root, record.env, row.title, self.keyed(key), given)

    def release(self, record, key: str = "", agent=None) -> None:
        self._gate(record, Hold(reach=Reach.BOTH), key, agent)

    @cached_property
    def journal(self) -> Journal:
        return Journal(self)

    @classmethod
    def renamed_from(cls) -> dict[str, str]:
        pairs = (alias if isinstance(alias, tuple) else (alias, "") for alias in cls.aliases)
        return {old: f"{cls.name}.{key}" if key else cls.name for old, key in pairs}

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title, "abstract": self.abstract, "help": self.help, "explains": self.explains, "default": self.default, "fixed": self.fixed,
                "label": self.label, "hint": self.hint, "position": self.position, "group": self.group.key, "trigger_label": self.trigger_label,
                "keywords": list(self.keywords), "when": self.when,
                "listens": sorted(set(self.journal.events.names)), "trigger": self.trigger.described(),
                "behaviours": {key: b.describe() for key, b in self.behaviours.items()},
                "lines": {key: line.describe() for key, line in self.lines.items()},
                "guards": [asdict(guard) for guard in self.journal.agent.guards],
                "settings": [s.describe() for s in self.settings]}
