import hashlib
from itertools import islice
import math
from dataclasses import dataclass
import secrets
import tempfile
import time
from pathlib import Path
from enum import StrEnum
from typing import TypedDict

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from controllers.marks import internal
from controllers.messages import Messages
from agents.control import pause, permit, resume
from controllers.types import Agents, Environments, Nudges, Todos
from engine.sessions import Sessions
from controllers.notices import Notices
from engine.record import Record
from features.format import VIEWER, formatted, shaped
from features.message_buttons.shaping import Button, spent
from engine.project_files import read_source
from features.phone.export import Export, export
from features.phone.places import MAIN, Place, places
from surfaces.agent_state import agent_state
from features.phone.push import Keys, allowed, send, unpadded
from features.phone.resource import Phone
from features.plans.controller import WAITING as PLAN_WAITS, Plans
from features.plans.resource import PHASE
from features.sharing.controller import Shares
from features.status_bar.bar import current
from resources.shapes import level_named
from resources.base import AGENT, PROJECT, SYSTEM, USER, Refused, titled
from features.work_modes.modes import mode_of, pick
from features.helpers.controller import Helpers
from features import FEATURES
from surfaces.summary import JournalSummary, lately_summarized, subagents
from features.trigger import DAY

CODE_SECONDS = 600
HELPERS_SHOWN = 10
DAYS = (1, 7, 30)
SEEN_EVERY = 60
DEVICE_LONGEST = 60
KEPT = ("key", "code", "short", "code_until", "expires", "environment", "journal", "days", "push", "pushed", "home", "tries")
SHORT_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
SHORT_LENGTH = 8
FEED = 40
CARDS = ("todo", "question", "suggestion", "plan", "report", "doc", "work", "agent")
WAITING_CARD = "waiting"
LISTED = 20
MOST_TRIES = 10
SAID = ("message", "question", "comment")
REACTED = ("message", "comment")
AUTO = "work_tracking.auto"
HIDDEN = ("phone", "share", "plugin")
WAITING = ("question", "plan", "report", "doc")


class WorkState(StrEnum):
    NEEDS = "needs"
    WORKING = "working"
    IDLE = "idle"
    REPORTED = "reported"
    FINISHED = "finished"
    STOPPED = "stopped"
    ENDED = "ended"


@dataclass(frozen=True)
class HelperAgent:
    status: str = ""
    at: float = 0.0
    started: float = 0.0
    tool: str = ""
    file: str = ""

    @classmethod
    def from_payload(cls, payload: dict) -> "HelperAgent":
        return cls(status=payload.get("status", ""), at=float(payload.get("at", 0.0)),
                   started=float(payload.get("started", 0.0)), tool=payload.get("tool", ""), file=payload.get("file", ""))


@dataclass(frozen=True)
class HelperSnapshot:
    name: str = ""
    owner: str = ""
    attention_kind: str = ""
    attention_text: str = ""
    silent: bool = False
    agent: HelperAgent = HelperAgent()
    todo: int = 0

    @classmethod
    def from_payload(cls, payload: dict) -> "HelperSnapshot":
        attention = payload.get("attention") or {}
        agent = payload.get("agent") or {}
        work = payload.get("work") or payload.get("last") or {}
        return cls(name=payload.get("name", ""), owner=payload.get("owner", ""),
                   attention_kind=attention.get("kind", ""), attention_text=attention.get("text", ""),
                   silent=bool(payload.get("silent")), agent=HelperAgent.from_payload(agent), todo=int(work.get("todo", 0)))


def helper_state(row, environment: HelperSnapshot, now: float) -> WorkState:
    if row.completed:
        return WorkState.FINISHED
    if row.report:
        return WorkState.REPORTED
    if environment.attention_kind or environment.silent:
        return WorkState.NEEDS
    if not environment.agent.status or environment.agent.status == "stopped":
        return WorkState.STOPPED if row.stopped_by_user else WorkState.ENDED
    if now - environment.agent.at <= 300:
        return WorkState.WORKING
    return WorkState.IDLE


def asked_permission(environment: HelperSnapshot) -> str:
    return environment.attention_text if environment.attention_kind == "permission" else ""


def helper_reason(environment: HelperSnapshot, now: float) -> str:
    if environment.attention_kind == "question":
        return f"Asks a question: {environment.attention_text}"
    if environment.attention_kind == "permission":
        return f"Wants a permission: {environment.attention_text}"
    if environment.silent:
        return f"Silent for {max(5, int((now - environment.agent.at) / 60))} min"
    return ""


def readable(kind: str) -> bool:
    return kind in CONTROLLERS and kind not in HIDDEN


class Marked(TypedDict):
    type: str
    n: str
    ref: str
    who: str
    created: float
    label: str


class Mark(Marked, total=False):
    name: str
    detail: str
    icon: str
    tone: str
    color: str
    state: str
    command: str


class HelperTodo(TypedDict, total=False):
    n: int
    title: str
    completed: float


@dataclass(frozen=True)
class Session:
    n: int
    thoughts: list
    cards: list
    subagents: list
    skill_loads: list
    compactions: list
    whispers: list

    @classmethod
    def from_view(cls, view: dict) -> "Session":
        data = view["data"]
        return cls(view["n"], data.get("thoughts") or [], data.get("cards") or [], data.get("subagent_rows") or [], data.get("skill_loads") or [],
                   data.get("compactions") or [], data.get("whispers") or [])

    def mark(self, at: float, label: str, kind: str = "card", **shown: str | None) -> Mark:
        return Mark(type=kind, n=f"{self.n}-{at}", ref=f"{kind}:{self.n}-{at}", who="agent", created=at, label=label,
                    **{key: value for key, value in shown.items() if value is not None})

    def marks(self) -> list[Mark]:
        return [
            *(self.mark(t["at"], t["text"], kind="thought") for t in self.thoughts),
            *(self.mark(c["at"], c["label"], icon=c.get("icon"), name=c.get("name", c.get("plugin")), detail=c.get("detail"), tone=c.get("tone"),
                        color=c.get("color"), state=c.get("state"), command=c.get("command")) for c in self.cards),
            *(self.mark(sub["at"], "Refused a subagent" if sub.get("refusal") else "Dispatched a subagent", icon="agents", name=sub["task"],
                        detail=sub["refusal"] if sub.get("refusal") else sub.get("model"), tone="danger" if sub.get("refusal") else None)
              for sub in self.subagents if "at" in sub),
            *(self.mark(sub["ended"], f"Subagent {sub.get('status', 'finished')}", icon="agents", name=sub["task"], tone="good")
              for sub in self.subagents if sub.get("ended") and not sub.get("refusal")),
            *(self.mark(load["at"], "Loaded skill", icon="book", name=load["skill"], tone="good") for load in self.skill_loads),
            *(self.mark(done["at"], "The agent compacted its context", icon="activity", tone="warn") for done in self.compactions),
            *(self.mark(w["at"], w["title"], icon="reminders") for w in self.whispers),
        ]


class Listed(TypedDict):
    ref: str
    type: str
    n: int
    title: str
    updated: float


class Listing(TypedDict):
    rows: list[Listed]
    total: int


class Source(TypedDict):
    path: str
    kind: str
    text: str
    lines: int


class Waiting(TypedDict):
    ref: str
    type: str
    n: int
    title: str
    created: float


class Running(TypedDict):
    state: str
    prompt: str
    paused: bool
    context: int
    usage: list[dict]
    auto: bool
    mode: str
    helpers: list[dict]
    subagents: list[dict]


class PlanTodo(TypedDict):
    n: int
    title: str
    done: bool


class PlanPhase(TypedDict):
    title: str
    checkpoint: bool
    todos: list[PlanTodo]


class PlanStrip(TypedDict):
    n: int
    title: str
    abstract: str
    status: str
    current: int
    updated: float
    phases: list[PlanPhase]
    hold: int


class Feed(TypedDict):
    items: list[dict]
    waiting: list[Waiting]
    agent: str
    notices: list[dict]
    running: Running
    plan: PlanStrip | None


class Code(TypedDict):
    n: int
    link: str
    short: str
    code_until: float
    address: str


class Stale(Refused):
    pass


def typed(code: str) -> str:
    return "".join(letter for letter in code.upper() if letter in SHORT_LETTERS)


def hashed(secret: str) -> str:
    return hashlib.sha256(secret.encode()).hexdigest()


def in_feed(kind: str, row) -> bool:
    return kind != "message" or not (row.data.get("window") or row.data.get("acknowledgement"))


class Phones(Controller):
    resource = Phone

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        self._untouched(data)
        return super().create(title, abstract, brief, **data)

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        self._untouched(data)
        return super().update(n, title, abstract, brief, outcome, **data)

    def _untouched(self, data: dict) -> None:
        if set(data) & set(KEPT):
            raise Refused(f"a phone's {', '.join(sorted(set(data) & set(KEPT)))} are set only by scanning the code in the viewer's Connect your phone dialog")

    @internal
    def connect(self, days: int = 7) -> Code:
        if self.actor != USER:
            raise Refused("only the user connects a phone, from the viewer's Connect your phone dialog")
        if int(days) not in DAYS:
            raise Refused(f"a phone stays connected for {', '.join(map(str, DAYS))} days, not {days}")
        active = self._active()
        if active is not None:
            raise Refused(f"{active.title} is connected: stop that session first, one phone at a time")
        for row in self.summaries():
            if not row.get("key") and row.get("code") and not row["completed"] and not row["deleted"]:
                self.complete(row["n"], how="a newer code replaced it")
        code = secrets.token_urlsafe(24)
        short = "".join(secrets.choice(SHORT_LETTERS) for _ in range(SHORT_LENGTH))
        made = super().create("A phone, not yet connected", environment=self.record.env, code=hashed(code), short=hashed(short),
                              code_until=time.time() + CODE_SECONDS, days=int(days))
        address = Shares(self.record, actor=SYSTEM)._address()
        return Code(n=made.n, link=f"https://{address}/p/#{code}", short=f"{short[:4]}-{short[4:]}", code_until=made.code_until, address=address)

    def _pair(self, code: str, device: str) -> tuple[Phone, str] | None:
        now = time.time()
        with self.record.locked(PROJECT):
            given = {hashed(code), hashed(typed(code))}
            found = next((row["n"] for row in self.summaries() if given & {row.get("code"), row.get("short")} - {"", None}
                          and not row["completed"] and not row["deleted"]), None)
            if found is None:
                self._missed()
                return None
            phone = self.load(found)
            if phone.code_until < now or self._active() is not None:
                return None
            key = secrets.token_urlsafe(32)
            named = titled(" ".join(str(device).split())[:DEVICE_LONGEST] or "A phone")
            paired = super().update(phone.n, title=named, key=hashed(key), code="", short="", code_until=0, expires=now + phone.days * DAY, last_seen=now)
        Notices(Record(self.record.root, paired.environment), actor=SYSTEM).create(
            f"A phone connected, {named}", brief="If that was not you, disconnect it from the phone button in the top bar.", tone="warn")
        return paired, key

    def _missed(self) -> None:
        for row in self.summaries():
            if not row.get("code") or row["completed"] or row["deleted"]:
                continue
            tries = self.load(row["n"]).tries + 1
            super().update(row["n"], tries=tries)
            if tries >= MOST_TRIES:
                self.complete(row["n"], how=f"{MOST_TRIES} wrong codes were tried, so this code no longer works")

    def _active(self) -> Phone | None:
        now = time.time()
        found = next((row["n"] for row in self.summaries() if row.get("key") and row.get("expires", 0) > now and not row["completed"] and not row["deleted"]), None)
        return self.load(found) if found else None

    def _by_key(self, key: str) -> Phone | None:
        found = next((row["n"] for row in self.summaries() if key and row.get("key") == hashed(key) and not row["deleted"]), None)
        if found is None:
            return None
        phone = self.load(found)
        if phone.connected and time.time() - phone.last_seen > SEEN_EVERY:
            return super().update(phone.n, last_seen=time.time())
        return phone

    def _home(self, phone: Phone) -> Record:
        return Record(self.record.root if phone.journal is None else Path(phone.journal), phone.environment, memo=True)

    def _places(self) -> list[Place]:
        return places(self.record.root)

    def _start(self, phone: Phone, starting) -> Phone:
        found = next((place for place in self._places() if place.root == starting.journal), None)
        if found is None or starting.environment not in found.environments:
            raise Refused(f"no journal at {starting.journal!r} with an environment {starting.environment!r} on this machine")
        if starting.environment in found.working:
            raise Stale(f"an agent is already working in {starting.environment}")
        Environments(Record(Path(found.root), MAIN), actor=USER).action("launch")(found.row(starting.environment), agent=starting.agent)
        return self._switch(phone, starting)

    def _switch(self, phone: Phone, moving) -> Phone:
        found = next((place for place in self._places() if place.root == moving.journal), None)
        if found is None or moving.environment not in found.environments:
            raise Refused(f"no running journal at {moving.journal!r} with an environment {moving.environment!r} on this machine")
        journal = None if Path(found.root) == self.record.root.resolve() else found.root
        return super().update(phone.n, journal=journal, environment=moving.environment, picked={**phone.picked, found.root: time.time()})

    def _picked(self, phone: Phone) -> list[Place]:
        return sorted(self._places(), key=lambda place: -phone.picked.get(place.root, 0.0))

    def _auto(self, phone: Phone, on: bool) -> bool:
        home = self._home(phone)
        if bool(home.setting("features", {}).get(AUTO)) != on:
            home.set_setting("features", {**home.setting("features", {}), AUTO: on})
            Nudges(home, actor=USER)._to_primary(f"the user turned auto {'on' if on else 'off'}", "journal settings shows every switch")
        return on

    def _mode(self, phone: Phone, mode: str) -> str:
        return pick(self._home(phone), mode, USER)

    def _permit(self, phone: Phone, helper: int | None, allow: bool) -> dict:
        home = self._home(phone)
        place = phone.environment if helper is None else Helpers(home, actor=USER).load(helper).environment
        holder = Sessions(home.root).holder(place)
        if not holder:
            raise Refused(f"No agent is running in {place}, so there is no permission to answer")
        return permit(home.root, place, holder, allow)

    def _stop_helper(self, phone: Phone, n: int) -> None:
        Helpers(self._home(phone), actor=USER).stop(n)

    def _list(self, phone: Phone, kind: str) -> Listing:
        if kind not in CARDS:
            raise Refused(f"a phone's home screen shows {', '.join(CARDS)}, not {kind!r}")
        rows = CONTROLLERS[kind](self._home(phone), actor=SYSTEM).summaries()
        kept = [row for row in rows if not row["deleted"] and not row["completed"] and row.get("environment") in (phone.environment, None, "")]
        newest = sorted(kept, key=lambda row: row["updated"], reverse=True)[:LISTED]
        return Listing(rows=[Listed(ref=f"{kind}:{row['n']}", type=kind, n=row["n"], title=row["title"], updated=row["updated"]) for row in newest],
                       total=len(kept))

    def _arrange(self, phone: Phone, cards: list[str]) -> Phone:
        unknown = [card for card in cards if card not in (*CARDS, WAITING_CARD)]
        if unknown:
            raise Refused(f"no home screen card called {', '.join(unknown)}")
        return super().update(phone.n, home=list(dict.fromkeys(cards)))

    def _source(self, phone: Phone, asked: str) -> Source:
        project = self._home(phone).root.parent.resolve()
        source = read_source(project, asked)
        return Source(path=source.path, kind=source.kind, text=source.text, lines=source.lines)

    def _push_key(self) -> str:
        return unpadded(Keys.kept(self.record.root).public)

    def _subscribe(self, phone: Phone, endpoint: str) -> Phone:
        if not allowed(endpoint):
            raise Refused("a phone's notifications come only through Apple's, Google's, Mozilla's or Microsoft's push service")
        return super().update(phone.n, push=endpoint, pushed=[waiting["ref"] for waiting in self._waiting(phone)])

    def _notify(self) -> None:
        phone = self._active()
        if phone is None or phone.push is None:
            return
        waiting = [item["ref"] for item in self._waiting(phone)]
        if set(waiting) - set(phone.pushed):
            send(Keys.kept(self.record.root), phone.push, f"https://{Shares(self.record, actor=SYSTEM)._address()}")
        if waiting != phone.pushed:
            super().update(phone.n, pushed=waiting)

    def _press(self, phone: Phone, pressing):
        kind, _, n = pressing.ref.partition(":")
        if not readable(kind) or not n.isdigit():
            raise Refused(f"no buttons on {pressing.ref!r}")
        home = self._home(phone)
        rows = CONTROLLERS[kind](home, actor=USER)
        row = rows.load(int(n))
        if row.deleted or not self._reaches(phone, row):
            raise Refused(f"{pressing.ref} is not in this phone's environment")
        buttons = [Button.from_payload(given) for given in row.data.get("buttons") or []]
        pressed = list(row.data.get("pressed") or [])
        button = next((one for one in buttons if one.label == pressing.label and not spent(one, buttons, pressed)), None)
        if button is None:
            raise Stale(f"{pressing.label!r} is no longer on {pressing.ref}")
        if button.say:
            Messages(home, actor=USER).create(titled(button.say), brief=button.say, about=pressing.ref, via=f"phone:{phone.n}")
        elif button.n is None:
            CONTROLLERS[button.type](home, actor=USER).action(button.action)(**(button.body or {}))
        else:
            CONTROLLERS[button.type](home, actor=USER).action(button.action)(button.n, **(button.body or {}))
        return rows.action("set")(row.n, key="pressed", value=list(dict.fromkeys([*pressed, button.label])))

    def _say(self, phone: Phone, said):
        text = said.brief.strip()
        if not text:
            raise Refused("a message needs words")
        return Messages(self._home(phone), actor=USER).create(titled(text), brief=text, idempotency=said.idempotency, about=said.about,
                                                             via=f"phone:{phone.n}")

    def _feed(self, phone: Phone, before: float = math.inf) -> Feed:
        home = self._home(phone)
        said = [self._said(home, kind, row) for kind in SAID for row in self._latest(home, kind, before)]
        items = sorted((item for item in said if item), key=lambda item: item["created"])[-FEED:]
        faces = self._faces(home, {item["ref"] for item in items})
        items = [{**item, "reactions": faces.get(item["ref"], [])} for item in items]
        since = items[0]["created"] if items else before
        marks = [mark for mark in self._marks(home, since) if mark["created"] < before]
        helpers = self._helpers(home) if any(item["data"].get("sent_to") for item in items) else {}
        items = sorted([*({**item, "to": helpers.get(item["data"].get("sent_to"))} for item in items), *marks], key=lambda item: item["created"])
        return Feed(items=items, waiting=self._waiting(phone), agent=agent_state(home, phone.environment), notices=self._notices(home),
                    running=self._running(home, phone.environment), plan=self._plan(home))

    def _plan(self, home: Record) -> PlanStrip | None:
        plans = Plans(home, actor=SYSTEM)
        plan = next(iter(plans._running()), None)
        if plan is None:
            return None
        phases = [PlanPhase(title=formatted(phase[PHASE.title], home, VIEWER), checkpoint=bool(phase[PHASE.checkpoint]),
                            todos=[PlanTodo(n=row.n, title=formatted(row.title, home, VIEWER), done=bool(row.completed)) for row in plans._members(phase)])
                  for phase in plan.phases]
        return PlanStrip(n=plan.n, title=formatted(plan.title, home, VIEWER), abstract=formatted(plan.abstract, home, VIEWER), status=plan.status,
                         current=plan.current, updated=plan.updated, phases=phases, hold=dict(FEATURES["ask_questions"].values(home))["hold"])

    def _marks(self, home: Record, since: float) -> list[Mark]:
        agents = CONTROLLERS["agent"](home, actor=SYSTEM)
        rows = [shaped(agents.load(row["n"]), home, VIEWER) for row in agents.summaries() if not row["deleted"] and row["updated"] >= since]
        found = [made for row in rows if not row["data"].get("parent") for made in Session.from_view(row).marks()]
        return [made for made in found if made["created"] >= since]

    def _bar(self, phone: Phone) -> dict:
        return current(self._home(phone))

    def _faces(self, home: Record, refs: set[str]) -> dict[str, list[dict]]:
        reactions = CONTROLLERS["reaction"](home, actor=SYSTEM)
        found: dict[str, list[dict]] = {}
        for n in [row["n"] for row in reactions.summaries() if not row["deleted"] and set(row.get("refs", [])) & refs]:
            made = reactions.load(n)
            for ref in set(made.refs) & refs:
                found.setdefault(ref, []).append({"face": made.face, "who": made.seen[0] if made.seen else ""})
        return found

    def _react(self, phone: Phone, reacting):
        if reacting.type not in REACTED:
            raise Refused(f"the phone reacts to {' and '.join(REACTED)}s, not to a {reacting.type}")
        rows = CONTROLLERS[reacting.type](self._home(phone), actor=USER)
        rows.react(reacting.n, reacting.face)
        return rows.load(reacting.n)

    def _latest(self, home: Record, kind: str, before: float) -> list:
        rows = CONTROLLERS[kind](home, actor=SYSTEM)
        loaded = (rows.load(row["n"]) for row in reversed(rows.summaries()) if not row["deleted"])
        return list(islice((row for row in loaded if row.created < before and in_feed(kind, row)), FEED))[::-1]

    def _said(self, home: Record, kind: str, row) -> dict:
        said = {**shaped(row, home, VIEWER), "who": row.seen[0] if kind != "question" and row.seen else "agent", "files": dict(row.files)}
        if kind != "question":
            return said
        return {**said, "hold": dict(FEATURES["ask_questions"].values(home))["hold"]}

    def _waiting(self, phone: Phone) -> list[Waiting]:
        home = self._home(phone)
        found = []
        for kind in WAITING:
            controller = CONTROLLERS[kind](home, actor=SYSTEM)
            for n in [row["n"] for row in controller.summaries() if not row["deleted"] and not row["completed"]]:
                row = controller.load(n)
                if self._reaches(phone, row) and self._owed(row):
                    found.append(Waiting(ref=row.ref, type=kind, n=row.n, title=row.title, created=row.created))
        return found

    def _owed(self, row) -> bool:
        if row.type == "question":
            return True
        if row.type == "plan":
            return row.status == "ready"
        buttons = [Button.from_payload(given) for given in row.data.get("buttons") or []]
        pressed = list(row.data.get("pressed") or [])
        return USER not in row.seen or any(not spent(button, buttons, pressed) for button in buttons)

    def _reaches(self, phone: Phone, row) -> bool:
        environment = row.data.get("environment")
        if environment in (phone.environment, None, ""):
            return True
        place = Environments(self._home(phone), actor=SYSTEM)._titled(environment)
        return bool(place and place.helping and place.launched_from == phone.environment)

    def _file(self, phone: Phone, ref: str, name: str) -> Path:
        kind, _, n = ref.partition(":")
        if not readable(kind) or not n.isdigit():
            raise Refused(f"a phone opens files of messages and of the rows it can read, not {ref!r}")
        controller = CONTROLLERS[kind](self._home(phone), actor=SYSTEM)
        row = controller.load(int(n))
        folder = controller.folder(row.n).resolve()
        found = (folder / Path(name).name).resolve()
        if row.deleted or not self._reaches(phone, row) or name not in row.files or found.parent != folder or not found.is_file():
            raise Refused(f"no file {name!r} on {ref}")
        return found

    def _running(self, home: Record, environment: str) -> Running:
        holder = Sessions(home.root).holder(environment)
        row = Agents(home, actor=SYSTEM)._titled(holder) if holder else None
        summary = lately_summarized(home.root)
        shared = dict(state=agent_state(home, environment), prompt=self._prompt(summary, environment), auto=bool(home.setting("features", {}).get(AUTO)), mode=mode_of(home),
                      helpers=self._helpers_of(home, summary), subagents=self._subagents_of(home, subagents(Agents(home, actor=SYSTEM).primary())))
        if row is None:
            return Running(paused=False, context=0, usage=[], **shared)
        return Running(paused=bool(row.paused), context=int(row.context), usage=list(row.usage.get("windows", [])), **shared)

    def _prompt(self, summary: JournalSummary, environment: str) -> str:
        here = next((HelperSnapshot.from_payload(entry) for entry in summary["environments"] if entry.get("name") == environment), HelperSnapshot())
        return asked_permission(here)

    def _helpers_of(self, home: Record, summary: JournalSummary) -> list[dict]:
        environments = list(map(HelperSnapshot.from_payload, summary["helpers"]))
        now = time.time()
        found = []
        for row in Helpers(home, actor=SYSTEM).all(completed=True, last=HELPERS_SHOWN):
            environment = next((entry for entry in environments if entry.owner == row.ref), HelperSnapshot())
            agent = environment.agent
            todo = self._helper_todo(home, environment)
            state = helper_state(row, environment, now)
            view = shaped(row, home, VIEWER)
            file = Path(agent.file).name if agent.file else ""
            doing = " ".join(part for part in (agent.tool, file) if part)
            found.append({"n": row.n, "title": view["title"], "name": row.name, "provider": row.provider, "model": row.model,
                          "state": state.value, "reason": formatted(helper_reason(environment, now), home, VIEWER), "prompt": asked_permission(environment),
                          "now": doing,
                          "started": agent.started or row.created, "at": agent.at or row.updated, "todo": todo,
                          "completed_at": row.completed, "stopped_by_user": row.stopped_by_user,
                          "report": formatted(row.report, home, VIEWER) if row.report else ""})
        return found

    def _helper_todo(self, home: Record, environment: HelperSnapshot) -> HelperTodo:
        if not environment.todo:
            return {}
        record = Record(home.root, environment.name)
        row = Todos(record, actor=SYSTEM).load(environment.todo)
        view = shaped(row, record, VIEWER)
        return {"n": row.n, "title": view["title"], "completed": row.completed}

    def _subagents_of(self, home: Record, rows: list[dict]) -> list[dict]:
        found = []
        for row in rows:
            match row:
                case {"running": True}:
                    state = "working"
                case {"refusal": refusal} if refusal:
                    state = "refused"
                case {"status": "stopped"}:
                    state = "stopped"
                case _:
                    state = "finished"
            found.append({**row, "state": state, "task": formatted(row.get("task", ""), home, VIEWER),
                          "outcome": formatted(row.get("outcome", ""), home, VIEWER),
                          "refusal": formatted(row.get("refusal", ""), home, VIEWER)})
        return found

    def _helper(self, phone: Phone, n: int) -> dict:
        home = self._home(phone)
        row = Helpers(home, actor=SYSTEM).load(n)
        if not self._reaches(phone, row):
            raise Refused(f"helper {n} is not in this phone's environment")
        summary = lately_summarized(home.root)
        payload = next((entry for entry in summary["helpers"] if entry["owner"] == row.ref), {})
        environment = HelperSnapshot.from_payload(payload)
        helper = next(entry for entry in self._helpers_of(home, summary) if entry["n"] == n)
        record = Record(home.root, row.environment)
        agent = Agents(record, actor=SYSTEM).primary()
        activity = [] if agent is None else Session.from_view(shaped(agent, record, VIEWER)).marks()[-5:][::-1]
        return {**helper, "activity": activity, "running": bool(environment.agent.status and environment.agent.status != "stopped")}

    def _holder(self, phone: Phone) -> str:
        holder = Sessions(self._home(phone).root).holder(phone.environment)
        if not holder:
            raise Refused(f"No agent is running in {phone.environment}, so there is nothing to pause or stop")
        return holder

    def _pause(self, phone: Phone) -> dict:
        return self._pressed(phone, pause)

    def _resume(self, phone: Phone) -> dict:
        return self._pressed(phone, resume)

    def _pressed(self, phone: Phone, press) -> dict:
        try:
            return press(self._home(phone).root, phone.environment, self._holder(phone))
        except Refused as refused:
            raise Refused(f"The agent in {phone.environment} isn't running right now, so there is nothing to pause or resume") from refused

    def _stop(self, phone: Phone):
        self._holder(phone)
        environments = Environments(self._home(phone), actor=USER)
        return environments.stop(environments.find(phone.environment).n)

    def _helpers(self, home: Record) -> dict[str, str]:
        return {sub["task_id"]: sub["task"] for row in Agents(home, actor=SYSTEM)._standing() for sub in row.data.get("subagent_rows") or [] if sub.get("task_id")}

    def _notices(self, home: Record) -> list[dict]:
        return [shaped(row, home, VIEWER) for row in CONTROLLERS["notice"](home, actor=SYSTEM)._standing() if not row.data.get("agent")]

    def _close(self, phone: Phone, n: int):
        notices = CONTROLLERS["notice"](self._home(phone), actor=USER)
        if notices.load(n).data.get("agent"):
            raise Refused(f"notice {n} belongs to a subagent's chat, not the phone's")
        return notices.complete(n, how="closed on the phone")

    def _export(self, phone: Phone, ref: str) -> Export:
        return export(self._reached(phone, ref), self._home(phone))

    def _share(self, phone: Phone, ref: str) -> str:
        row = self._reached(phone, ref)
        return CONTROLLERS["share"](self._home(phone), actor=USER).create(f"{row.type}:{row.n}").abstract

    def _reached(self, phone: Phone, ref: str):
        kind, _, n = ref.partition(":")
        if not readable(kind) or not n.isdigit():
            raise Refused(f"a phone opens any row of its environment except phones, shared links and plugins, not {ref!r}")
        row = CONTROLLERS[kind](self._home(phone), actor=SYSTEM).load(int(n))
        if row.deleted or not self._reaches(phone, row):
            raise Refused(f"{kind} {n} is not in this phone's environment")
        return row

    def _read(self, phone: Phone, ref: str) -> dict:
        row, home = self._reached(phone, ref), self._home(phone)
        rows = CONTROLLERS[row.type](home, actor=USER)
        comments = [{**shaped(made, home, VIEWER), "who": made.seen[0] if made.seen else AGENT} for made in rows.comments(row.n)]
        return {**shaped(rows.read(row.n), home, VIEWER), "comments": comments, "priority_name": level_named(row.data.get("priority"))}

    def _comment(self, phone: Phone, commenting):
        row = self._reached(phone, commenting.ref)
        if not row.takes_comments:
            raise Refused(f"a {row.type} takes no comments")
        if not commenting.text.strip():
            raise Refused("a comment needs words")
        return CONTROLLERS[row.type](self._home(phone), actor=USER).comment(row.n, commenting.text)

    def _answer(self, phone: Phone, chosen):
        questions = CONTROLLERS["question"](self._home(phone), actor=USER)
        if questions.load(chosen.n).completed:
            raise Stale(f"question {chosen.n} was already answered")
        if not chosen.answer.strip():
            raise Refused("an answer needs words")
        return questions.complete(chosen.n, how=chosen.answer.strip(), via=f"phone:{phone.n}")

    def _attach(self, phone: Phone, n: int, name: str, data: bytes):
        messages = Messages(self._home(phone), actor=USER)
        message = messages.load(n)
        if message.deleted or message.data.get("via") != f"phone:{phone.n}":
            raise Refused(f"message {n} was not sent from this phone")
        named = Path(name).name.strip() or "file"
        with tempfile.TemporaryDirectory() as folder:
            kept = Path(folder) / named
            kept.write_bytes(data)
            return messages.attach(message.n, str(kept))

    def _dismiss(self, phone: Phone, n: int):
        questions = CONTROLLERS["question"](self._home(phone), actor=USER)
        if questions.load(n).completed:
            raise Stale(f"question {n} was already answered")
        return questions.dismiss(n)

    def _approve(self, phone: Phone, approval):
        plans = CONTROLLERS["plan"](self._home(phone), actor=USER)
        plan = plans.load(approval.n)
        if plan.updated != approval.updated or plan.status != "ready":
            raise Stale(f"plan {approval.n} changed since you opened it: look at it again")
        return plans.approve(plan.n)

    def _continue(self, phone: Phone, approval):
        plans = CONTROLLERS["plan"](self._home(phone), actor=USER)
        plan = plans.load(approval.n)
        if plan.updated != approval.updated or plan.status != PLAN_WAITS:
            raise Stale(f"plan {approval.n} changed since you opened it: look at it again")
        return plans.resume(plan.n)

    def _live(self) -> list[dict]:
        now = time.time()
        return [row for row in self.summaries() if not row["completed"] and not row["deleted"]
                and ((row.get("key") and row.get("expires", 0) > now) or row.get("code_until", 0) > now)]


resources_module.register(Phone)
types_module.register(Phones)
