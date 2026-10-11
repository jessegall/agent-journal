"""Runs one registration through the entry the engine really uses, and reads what it did from the record.

On 2.x a handler takes a Context and writes through controllers, so the rows are a temporary real Record
built from the Given and the outcomes about rows are read from what that record gained. The Fakes stand
in for everything that is not the record: the clock, the ids, the commands, the files, the processes and
the providers. Each kind has one entry and no kind has two, so the run and the engine cannot disagree.
"""

import tempfile
import time
from contextlib import contextmanager
from types import SimpleNamespace
from pathlib import Path

import commands.cli  # noqa: F401  wires the command line, as every process that runs the journal does
from controllers.types import Messages, Nudges
from engine.record import Record
from expects import Given
from expects.playing import Seen, World
from features.parts import AgentContext, Context
from resources.base import Refused, SYSTEM
from tests import isolation


class NoEntryForThisKind(LookupError):
    @classmethod
    def of(cls, kind: str) -> "NoEntryForThisKind":
        return cls(f"there is no way to play a {kind!r} registration yet; the run plays {', '.join(sorted(ENTRIES))}")


def scratch(given: Given) -> Record:
    """A record holding exactly what the Given states - its settings AND its rows - thrown away when the play ends."""
    record = Record(Path(tempfile.mkdtemp(dir=isolation.world())) / ".journal", "t")
    record.home.mkdir(parents=True)
    for name, value in dict(given.settings).items():
        part, _, key = name.partition(".")
        record.change_setting(part or "features", {key or part: value})
    for name, value in dict(given.remembered).items():
        owner, _, key = name.partition(".")
        record.state(owner or name).set(key or name, value)
    for row in given.rows:
        written(record, row)
    return record


def written(record: Record, row) -> None:
    """Puts one of the Given's rows into the record, through the controller that owns its type, so it is a row like any other."""
    from controllers.types import CONTROLLERS
    kind = getattr(row, "type", "") or type(row).__name__.lower()
    if kind not in CONTROLLERS:
        raise NoControllerForTheRow.of(kind)
    CONTROLLERS[kind](record, actor=SYSTEM).rows.persist(row)


class NoControllerForTheRow(LookupError):
    @classmethod
    def of(cls, kind: str) -> "NoControllerForTheRow":
        return cls(f"the Given names a row of kind {kind!r}, which no controller owns; name it as the resource dataclass of a registered type")


def speaking(record: Record, given: Given):
    """The agent row a handler speaks to, when the Given names one. A handler that reads context.agent and is given none fails here, by name, rather than at a bare attribute."""
    from controllers.types import Agents
    rows = Agents(record, actor=SYSTEM).rows.standing()
    return rows[0] if rows else None


def contexted(promise, given: Given, record: Record) -> Context:
    """The context a registration is handed: over the record, and an AgentContext speaking to the agent when the Given names one."""
    row = speaking(record, given)
    return (AgentContext if row else Context).of(promise.feature, record, row)


def what_was_said(record: Record) -> tuple[list, list]:
    """What reached the chat and what was nudged, read from the rows the journal keeps rather than from anything the play says about itself."""
    said = [row.brief or row.title for row in Messages(record, actor=SYSTEM).all(completed=True) if row.seen[:1] == ["agent"]]
    nudged = [(row.line, row.title, row.brief) for row in Nudges(record, actor=SYSTEM).all(completed=True)]
    return said, nudged


def rows_now(record: Record) -> tuple:
    from resources.types import TYPES
    from controllers.types import CONTROLLERS
    return tuple(sorted((name, len(CONTROLLERS[name](record, actor=SYSTEM).rows.every()))
                        for name in TYPES if name in CONTROLLERS))


def handled(promise, given: Given, record: Record, world: World) -> None:
    """A 2.x handler, through the entry the bus uses: its own handle, with a Context over the record. The Context carries an agent when the Given names one, since most handlers read it."""
    event, was = given.on, text_of(given.on)
    promise.part.handle(contexted(promise, given, record), event)
    world.seen.changed = text_of(event) if text_of(event) != was else None
    world.seen.kept = not stopped(event)


def formatted(promise, given: Given, record: Record, world: World) -> None:
    """A formatter, through its own format. It is a pure function of its text, so what it answers IS the outcome."""
    world.seen.changed = promise.part.format(Context.of(promise.feature, record), given.on)


def provider_of(agent):
    """The provider an agent row names, as the hook would carry it, or none when the Given names an agent with no provider."""
    from providers import PROVIDERS
    return PROVIDERS[agent.provider]() if agent is not None and agent.provider in PROVIDERS else None


def intercepted(promise, given: Given, record: Record, world: World) -> None:
    """An interceptor, through its own intercept. It answers a refusal, or nothing when it lets the call through."""
    why = promise.part.intercept(contexted(promise, given, record), given.on)
    world.seen.refused = why or None


def cancelled(promise, given: Given, record: Record, world: World) -> None:
    """A canceler, through its own cancel. It answers why the thing must not happen, or nothing to let it."""
    world.seen.refused = promise.part.cancel(contexted(promise, given, record), given.on) or None


def refused_before_the_write(promise, given: Given, record: Record, world: World) -> None:
    """An interceptor on a controller action, which refuses by raising before the write reaches the funnel. The Given names the controller class, how it is acted through, and the arguments the action got."""
    controller, acting, arguments = given.on
    try:
        promise.part.intercept(Context.of(promise.feature, record), controller(record, **acting), **arguments)
    except Refused as refusal:
        world.seen.refused = str(refusal)


def commanded(promise, given: Given, record: Record, world: World) -> None:
    """A command, through its own run: the controller it is on, then the arguments the Given states."""
    controller, *arguments = given.on
    try:
        world.seen.answered = promise.part.run(Context.of(promise.feature, record), controller(record, actor=SYSTEM), *arguments)
    except Refused as refusal:
        world.seen.refused = str(refusal)


def answered_a_hook(promise, given: Given, record: Record, world: World) -> None:
    """A responder, which answers a hook event and writes nothing."""
    world.seen.answered = promise.part(given.on)


ENTRIES = {"handler": handled, "formatter": formatted, "interceptor": intercepted, "canceler": cancelled,
           "action_interceptor": refused_before_the_write, "command": commanded, "responder": answered_a_hook}
"""One entry per kind, and no kind with two, so the run and the engine cannot disagree about how a registration is reached. A route has none yet: it is reached through the server, which an expectation does not stand up."""


def stopped(event) -> bool:
    """Whether a handler stopped the thing it was handed. A sending event carries it in its own data, which is how the engine reads it too."""
    data = getattr(event, "data", None)
    return bool(data.get("stopped")) if isinstance(data, dict) else False


def text_of(event) -> str | None:
    """The text an event carries, when it carries one. A sending event keeps it in its own data, which is where the engine reads it too."""
    data = getattr(event, "data", None)
    return data.get("text") if isinstance(data, dict) else None


def rows_held(record: Record) -> dict:
    """Every row the record holds, by type and number, with what it says now. The play is read by comparing this before and after, so a write that emits no event is seen too."""
    from controllers.types import CONTROLLERS
    held = {}
    for kind, controller in CONTROLLERS.items():
        for row in controller(record, actor=SYSTEM).rows.every():
            held[kind, row.n] = (repr((row.title, row.abstract, row.brief, row.sections, row.refs, row.seen, {key: value for key, value in row.data.items() if value}, row.outcome, bool(row.completed))), row)
    return held


def rows_touched(before: dict, after: dict) -> tuple[list, list]:
    """The rows the play created, and the rows it changed. An expectation is written about the row, so the rows themselves are handed back."""
    wrote = [row for key, (_, row) in after.items() if key not in before]
    updated = [row for key, (said, row) in after.items() if key in before and before[key][0] != said]
    return wrote, updated


def held_against_the_agents(record: Record) -> str | None:
    """Why the agents' writes are held after the play, read from the gate files the engine itself reads."""
    from controllers.types import Agents
    from engine.gates import holds
    whys = [one.why for row in Agents(record, actor=SYSTEM).rows.standing() for one in holds(record, row.title)]
    return whys[0] if whys else None


@contextmanager
def at_the_givens_hour(given: Given):
    """Holds the clock at the hour the Given names, for everything the play touches. A 2.x handler reads time.time() itself rather than asking a service, so without this an expectation about anything aged would read differently tomorrow."""
    was = time.time
    time.time = lambda: given.clock.seconds
    try:
        yield
    finally:
        time.time = was


def played(promise, expectation) -> Seen:
    """Builds the world the Given states, runs the registration through its own entry, and reads what it did."""
    if promise.kind not in ENTRIES:
        raise NoEntryForThisKind.of(promise.kind)
    given = expectation.given
    record, world = scratch(given), World.of(given)
    world.seen.before, held = rows_now(record), rows_held(record)
    with at_the_givens_hour(given):
        ENTRIES[promise.kind](promise, given, record, world)
    world.seen.after = rows_now(record)
    world.seen.said, world.seen.nudged = what_was_said(record)
    world.seen.remembered = record.state(promise.feature.name).all()
    world.seen.wrote, world.seen.updated = rows_touched(held, rows_held(record))
    world.seen.held = held_against_the_agents(record)
    return world.seen
