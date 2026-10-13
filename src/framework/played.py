"""Runs one registration through the entry the engine really uses, and reads what it did from the record.

On 2.x a handler takes a Context and writes through controllers, so the rows are a temporary real Record
built from the Given and the outcomes about rows are read from what that record gained. The Fakes stand
in for everything that is not the record: the clock, the ids, the commands, the files, the processes and
the providers. Each kind has one entry and no kind has two, so the run and the engine cannot disagree.
"""

import os
from dataclasses import dataclass, replace
import shutil
import tempfile
import time
from contextlib import contextmanager
from pathlib import Path

from controllers.types import Messages, Nudges
from declaring.holds import Hold
from engine.gates import HookCall, hold
from engine.paths import SECRETS_FOLDER_VARIABLE as FOLDER_VARIABLE
from engine.project_files import walk
from engine.record import Record
from expects import Given, Left
from receiving import ANSWER, HANDLE, LISTEN, REFUSE
from receiving.ticks import Services
import serving
from framework.lanes import lane_services
from expects.playing import Seen, World, remembered_by
from framework.parts import AgentContext, Context
from resources.base import Refused, SYSTEM


class NoEntryForThisKind(LookupError):
    @classmethod
    def of(cls, kind: str) -> "NoEntryForThisKind":
        return cls(f"there is no way to play a {kind!r} registration yet; the run plays {', '.join(sorted(ENTRIES))}")


def scratch(given: Given, inside: Path) -> Record:
    """A record holding exactly what the Given states - its settings AND its rows - thrown away when the play ends. The caller says which folder it is built in, because only the caller knows what else is running beside it."""
    record = Record(Path(tempfile.mkdtemp(dir=inside)) / ".journal", "t")
    record.home.mkdir(parents=True)
    for name, value in dict(given.settings).items():
        part, _, key = name.partition(".")
        record.change_setting(part or "features", {key or part: value})
    for name, value in dict(given.remembered).items():
        owner, _, key = name.partition(".")
        record.state(owner or name).set(key or name, value)
    for row in given.rows:
        written(record, row)
    for path, text in given.files.answers.items():
        staged(record.root.parent / path, text)
    if given.files.answers:
        walk(record.root.parent)
    if given.transcript:
        speaking_from(record, given.transcript)
    if given.held:
        holding(record, given.held)
    return record


def staged(path: Path, text: str) -> None:
    """Puts one file the Given says exists on disk under the scratch project, where whatever reads it will find it."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


def speaking_from(record: Record, text: str) -> None:
    """Writes the conversation the Given states inside the scratch project and points each agent row at it, so nothing names a path before the scratch exists."""
    from controllers.types import Agents
    agents = Agents(record, actor=SYSTEM)
    for row in agents.rows.standing():
        path = record.root.parent / f"{row.title}.transcript.jsonl"
        staged(path, text)
        agents.update(row.n, transcript=str(path))


def holding(record: Record, why: str) -> None:
    """Leaves every agent's writes held, as a feature that held them would have, in the gate file the engine reads."""
    from controllers.types import Agents
    for row in Agents(record, actor=SYSTEM).rows.standing():
        hold(record, row.title, "expects", Hold(why=why))


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


@dataclass(frozen=True)
class PlayedHook:
    """What a registration reads of the hook it is called under: the tool call, the moment, the folder the agent works in, the subagent it came from and why a session began."""

    tool: object
    event: str
    cwd: str
    agent: str
    source: str
    transcript: object = None


def hooked(given: Given, record: Record) -> PlayedHook:
    """The hook the Given declares, with its folder placed under the scratch project and the call the registration is asked about as its tool."""
    stated = given.hook
    return PlayedHook(given.on, stated.event, str(record.root.parent / stated.cwd), stated.agent, stated.source)


def contexted(promise, given: Given, record: Record) -> Context:
    """The context a registration is handed: over the record, and an AgentContext speaking to the agent when the Given names one. The hook carries the tool call an interceptor is asked about, as the engine's hook does."""
    row = speaking(record, given)
    return (AgentContext if row else Context).of(promise.feature, record, row, provider_of(row), hooked(given, record))


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
    """A responder, which answers the call the engine builds for a hook event: the provider and the agent the Given names, the record, and the hook the Given declares."""
    row = speaking(record, given)
    world.seen.answered = promise.part(HookCall(provider_of(row), record, hooked(given, record), row))


def play_services(promise, given: Given, record: Record, world: World) -> dict:
    """What a 3.0 receiver asked for, by type: the journal's own services over the scratch record, as the lane hands them, and the Fakes for what reaches outside it."""
    fakes = {serving.Commands: world.commands, serving.Files: world.files, serving.ReadFiles: world.files, serving.Clock: world.clock, serving.Ids: world.ids, serving.Terminal: world.terminal,
             **({serving.Processes: world.processes, serving.ReadProcesses: world.processes} if given.processes.answers else {}),
             **({serving.Providers: world.providers} if given.providers.answers else {})}
    services = Services({**lane_services(record, lambda: speaking(record, given)), **fakes})
    return services.given(type(promise.part).__name__, promise.feature.name, type(promise.part).wants())


def listened(promise, given: Given, record: Record, world: World) -> None:
    """A 3.0 listener, through its own listen. It writes nothing, so the facts it dispatches are the whole of what it did."""
    world.seen.facts += promise.part.listen(given.on, **play_services(promise, given, record, world))


def acted_on_a_fact(promise, given: Given, record: Record, world: World) -> None:
    """A 3.0 handler, through its own handle. It never decides whether to act, so what it writes and the facts it answers with are what it did."""
    world.seen.facts += promise.part.handle(given.on, **play_services(promise, given, record, world)) or []


def answered_a_request(promise, given: Given, record: Record, world: World) -> None:
    """A 3.0 answerer, through its own answer. It is read-only, so what it answers is the whole of what it did."""
    world.seen.answered = promise.part.answer(given.on, **play_services(promise, given, record, world))


def refused_the_write(promise, given: Given, record: Record, world: World) -> None:
    """A 3.0 refuser, through its own refuse. It either raises with its reason or lets the write through."""
    try:
        promise.part.refuse(given.on, **play_services(promise, given, record, world))
        world.seen.kept = True
    except Refused as why:
        world.seen.refused = str(why)


ENTRIES = {"handler": handled, "formatter": formatted, "interceptor": intercepted, "canceler": cancelled,
           "action_interceptor": refused_before_the_write, "command": commanded, "responder": answered_a_hook,
           LISTEN: listened, HANDLE: acted_on_a_fact, ANSWER: answered_a_request, REFUSE: refused_the_write}
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
        for row in controller(record, actor=SYSTEM).rows.every(deleted=True):
            held[kind, row.n] = (repr((row.title, row.abstract, row.brief, row.sections, row.refs, row.seen, {key: value for key, value in row.data.items() if value}, row.outcome, bool(row.completed), bool(row.deleted))), row)
    return held


def rows_touched(before: dict, after: dict, acted_on: set) -> tuple[list, list]:
    """The rows the play created, and the rows it changed, which includes a row it created and then went on to change. An expectation is written about the row, so the rows themselves are handed back."""
    wrote = [row for key, (_, row) in after.items() if key not in before]
    updated = [row for key, (said, row) in after.items() if key in before and before[key][0] != said or key in acted_on]
    return wrote, updated


def rows_acted_on(record: Record, since: int) -> set:
    """The rows an action other than creating moved during the play, read from the event log: a link, a comment, a completion."""
    return {(event.type, event.n) for event in record.event_log.events(since) if event.action != "created"}


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


@contextmanager
def with_the_scratch_secrets(record: Record):
    """Points the secrets folder at the scratch project for the whole play, so no secret value a play writes or drops is ever the user's own."""
    was = os.environ.get(FOLDER_VARIABLE)
    os.environ[FOLDER_VARIABLE] = str(record.root.parent / ".secrets")
    try:
        yield
    finally:
        if was is None:
            os.environ.pop(FOLDER_VARIABLE, None)
        else:
            os.environ[FOLDER_VARIABLE] = was


@contextmanager
def with_the_givens_programs(given: Given):
    """Leaves only the programs the Given names on the machine's path, when it names any, so a registration that looks for ffmpeg finds it or does not, as the Given says, wherever the play runs."""
    present = dict(given.processes.answers)
    was = shutil.which
    if present:
        shutil.which = lambda name, *args, **kwargs: present.get(name)
    try:
        yield
    finally:
        shutil.which = was


def files_left(record: Record) -> dict:
    """Every file under the scratch project after the play, by path under the project folder to what it holds and the bits it carries, which is what Wrote(File) and Removed read."""
    project = record.root.parent
    return {str(path.relative_to(project)): Left(path.read_text(errors="replace"), oct(path.stat().st_mode & 0o7777)[2:])
            for path in project.rglob("*") if path.is_file()}


class WhatTheAgentGot:
    """A driver that only remembers what it was given, by the channel it came through: whispered beside the turn, or sent as a line the agent must answer."""

    TAKES_CHANNEL = True

    def __init__(self):
        self.whispered: list[str] = []
        self.sent: list[str] = []

    def ready(self) -> bool:
        return True

    def whisper(self, text: str) -> None:
        self.whispered.append(text)

    def send(self, line: str, groups=(), yielding: str = "") -> bool:
        self.sent.append(line)
        return True

    def last_report(self):
        """No report: the play has no terminal to read one from, and the delivery marks only the row a report names."""
        return None


def reached_the_agent(record) -> WhatTheAgentGot:
    """What the agent was really given, by driving the engine's own delivery over a driver that records. A line that says it is a whisper and is delivered as a line is caught here, where reading the message's own flag would believe it."""
    from agents.actors import Agent
    got = WhatTheAgentGot()
    actor = Agent(record, got)
    for event in record.event_log.events():
        actor.notify(event)
    actor.flush()
    return got


def settings_now(record) -> dict:
    """Every setting the record holds after the play, by the same dotted name a Given states one with."""
    return {f"{part}.{key}": value for part, held in record.settings().items() if isinstance(held, dict) for key, value in held.items()}


def played(promise, expectation, inside: Path) -> Seen:
    """Builds the world the Given states, runs the registration through its own entry, and reads what it did."""
    if promise.kind not in ENTRIES:
        raise NoEntryForThisKind.of(promise.kind)
    given = expectation.given
    record, world = scratch(given, inside), World.of(given)
    with at_the_givens_hour(given), with_the_givens_programs(given), with_the_scratch_secrets(record):
        for earlier in given.earlier:
            ENTRIES[promise.kind](promise, replace(given, on=earlier, earlier=()), record, world)
        world.seen.forget()
        already_said, already_nudged = what_was_said(record) if given.earlier else ([], [])
        world.seen.before, held, since = rows_now(record), rows_held(record), record.event_log.last_id()
        ENTRIES[promise.kind](promise, given, record, world)
    world.seen.after = rows_now(record)
    said, nudged = what_was_said(record)
    world.seen.said, world.seen.nudged = said[len(already_said):], nudged[len(already_nudged):]
    world.seen.remembered = remembered_by(record, promise.feature.name)
    world.seen.wrote, world.seen.updated = rows_touched(held, rows_held(record), rows_acted_on(record, since))
    world.seen.held = held_against_the_agents(record)
    world.seen.files = files_left(record)
    world.seen.settings = settings_now(record)
    got = reached_the_agent(record)
    world.seen.whispered, world.seen.typed = got.whispered, got.sent
    return world.seen
