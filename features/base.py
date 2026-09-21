from abc import ABC
from functools import wraps
from typing import ClassVar

from controllers.base import COMMANDS, HANDLERS
from controllers.types import Agents, Features, Nudges
from engine import bus
from features import trigger
from engine.hooks import POLICIES, gate_file
from features.format import FORMATTERS
from resources.base import KEYWORDS, Refused, SYSTEM, WHOM
from engine.stored import read_json, write_json
from engine.wording import plural

REGISTRY: dict[str, type] = {}


def held(record, session: str) -> str:
    holds = read_json(gate_file(record.root, record.env, session), {})
    return "; ".join(why for why in holds.values() if why)


class Behaviour:
    def __init__(self, title: str, abstract: str = "", default: bool = True, trigger: dict | None = None):
        self.title, self.abstract, self.default, self.trigger = title, abstract, default, trigger or {}

    def describe(self) -> dict:
        return {"title": self.title, "abstract": self.abstract, "default": self.default, "trigger": dict(self.trigger)}


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


MARKS: dict[str, str] = {}


def marker(name: str):
    MARKS.setdefault(name, name)

    def mark(*args):
        bare = args[0] if len(args) == 1 and callable(args[0]) else None

        def put(fn):
            fn.marks = {**getattr(fn, "marks", {}), name: (*getattr(fn, "marks", {}).get(name, ()), *(() if bare else args))}
            return fn
        return put(bare) if bare else put
    return mark


event = marker("event")
gate = marker("gate")
formats = marker("formats")
command = marker("command")
handles = marker("handles")
textformatter = formats
interceptor = gate


class Feature(ABC):
    name: ClassVar[str] = ""
    title_: ClassVar[str] = ""
    abstract_: ClassVar[str] = ""
    help_: ClassVar[str] = ""
    trigger: ClassVar[dict] = {}
    behaviours: ClassVar[dict] = {}
    aliases: ClassVar[tuple] = ()      # names this feature used to have; a pair says the old feature is now one of its behaviours
    declares: ClassVar[tuple] = ()     # marks this feature offers: any feature marks a method with marker("<name>"), and this one is handed them all
    runs_for_subagents: ClassVar[bool] = False   # whether it acts on a subagent's session as well as the one the user talks to
    default: ClassVar[bool] = True
    fixed: ClassVar[bool] = False

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        if cls.name:
            REGISTRY[cls.name] = cls

    def marked(self, name: str) -> list[tuple[object, tuple]]:
        return [(getattr(self, attr), fn.marks[name]) for attr in dir(type(self))
                for fn in [getattr(type(self), attr)] if callable(fn) and name in getattr(fn, "marks", {})]

    def everyone_marked(self, name: str) -> list[tuple[object, tuple]]:
        from features import FEATURES
        return [found for feature in FEATURES.values() for found in feature.marked(name)]

    def listeners(self) -> list[tuple[str, object]]:
        return [(pattern, fn) for fn, patterns in self.marked("event") for pattern in patterns]

    def refusals(self) -> list:
        return [fn for fn, _ in self.marked("gate")]

    def formatters(self) -> list[tuple[object, tuple]]:
        return self.marked("formats")

    def commands(self) -> list[tuple[object, tuple]]:
        return self.marked("command")

    def guarded(self, fn):
        @wraps(fn)
        def run(controller, *args, **kwargs):
            if not self.enabled(controller.record):
                raise Refused(f"the {self.name} feature is off")
            return fn(controller, *args, **kwargs)
        return run

    def register(self) -> None:
        for name in self.declares:
            MARKS[name] = self.name
        for fn, (target, *_) in self.marked("handles"):
            HANDLERS.setdefault(target, []).append(lambda controller, fn=fn, **args: fn(controller, **args) if self.enabled(controller.record) else None)
        for fn, (type_, *_) in self.commands():
            COMMANDS.setdefault(type_, {})[fn.__name__] = self.guarded(fn)
        for pattern, handler in self.listeners():
            bus.on(pattern, handler, enabled=self.enabled)
        for handler in self.refusals():
            policy = lambda provider, record, payload, session, handler=handler: handler(provider, record, payload, session) if self.enabled(record) else ""  # noqa: E731
            policy.feature = self
            POLICIES.append(policy)
        for shaper, where in self.formatters():
            FORMATTERS.append((lambda text, record, shaper=shaper: shaper(text, record) if not record or self.enabled(record) else text, where))

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

    def setting(self, record, key: str, default=None):
        return record.setting(self.name, {}).get(key, default)

    def live(self, record) -> list:
        return [agent for agent in Agents(record, actor=SYSTEM)._standing() if self.mine(agent)]

    def hold(self, record, why: str, key: str = "") -> None:
        for agent in self.live(record):
            f = gate_file(record.root, record.env, agent.title)
            held = read_json(f, {})
            if held.get(self.keyed(key), "") != why:
                write_json(f, {**held, self.keyed(key): why})

    def release(self, record, key: str = "") -> None:
        self.hold(record, "", key)

    def nudge(self, record, agent, title: str, brief: str = "", private: bool = False) -> None:
        if self.mine(agent):
            Nudges(record, actor=SYSTEM).create(title, brief=brief, session=agent.title, private=private)

    def plural(self, n: int, word: str) -> str:
        return plural(n, word)

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title_, "abstract": self.abstract_, "help": self.help_, "default": self.default, "fixed": self.fixed,
                "listens": sorted({p for p, _ in self.listeners()}), "trigger": dict(self.trigger), "declares": list(self.declares),
                "behaviours": {key: b.describe() for key, b in self.behaviours.items()}}


class Recital(Feature):
    controller: ClassVar[type]
    said = "standing, read them"
    behaviours = {"whisper": Behaviour("Whisper a row when one of its keywords appears",
                                       "Said again once this many of the agent's tool uses have passed since it last spoke",
                                       trigger={"every": 50, "unit": trigger.USES})}

    @interceptor
    def touched(self, provider, record, hook, session) -> str:
        said = hook.tool.said.lower()
        if not said or not self.on(record, "whisper"):
            return ""
        agent = Agents(record, actor=SYSTEM).by_session(session)
        for row in self.standing(record, self.controller):
            words = [w for w in row.data.get(KEYWORDS) or [] if w and str(w).lower() in said]
            if words and self.quiet_enough(record, session, row.ref, agent):
                self.nudge(record, agent, f"{self.controller.resource.type} {row.n} — {row.title}", row.brief, private=True)
        return ""

    def quiet_enough(self, record, session: str, ref: str, agent) -> bool:
        f = record.root / "runtime" / f"touched-{session}.json"
        spoke, uses = read_json(f, {}), int(agent.uses or 0)
        since = self.cadence(record, "whisper").get("every") or 0
        if ref in spoke and uses - int(spoke[ref] or 0) < float(since):
            return False
        write_json(f, {**spoke, ref: uses})
        return True

    @event("agent.updated")
    def repeat(self, event, record) -> None:
        agent = self.agent_due(event, record)
        rows = [r for r in self.standing(record, self.controller) if r.data.get(WHOM, agent.title) == agent.title] if agent else []
        if rows:
            self.nudge(record, agent, f"{self.plural(len(rows), self.controller.resource.type)} {self.said}", "; ".join(f"{r.n}. {r.title}" for r in rows))
