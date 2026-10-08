import math
import time
from dataclasses import dataclass
from itertools import islice
from pathlib import Path
from typing import TypedDict

from controllers.messages import Messages
from controllers.notices import Notices
from controllers.questions import Questions
from controllers.reactions import Reactions
from controllers.types import CONTROLLERS, Agents, Comments, Environments, Todos, Works
from engine.record import Record
from engine.sessions import Sessions
from features.ask_questions.details import AskQuestionsDetails
from features.format import VIEWER, formatted, shaped
from features.helpers.controller import Helpers
from features.helpers.state import HelperSnapshot, asked_permission, helper_reason, helper_state
from features.phone.chat_view import card_shows, hidden, whisper_shows
from features.phone.members import rights_of
from features.phone.places import WAITED, owed
from features.suggestions.controller import Suggestions
from features.suggestions.details import SuggestionsDetails
from features.plans.controller import Plans
from features.plans.resource import PHASE
from features.work_modes.modes import mode_of
from features.work_tracking.auto import automatic
from resources.base import SYSTEM, Refused
from overview.summary import JournalSummary, lately_summarized, subagents

FEED = 40
HELPERS_SHOWN = 10
POSTED = {"message": Messages, "question": Questions, "comment": Comments, "suggestion": Suggestions}
ASKED = ("question", "suggestion")


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
    shows: str


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

    def mark(self, at: float, label: str, shows: str, kind: str = "card", **fields: str | None) -> Mark:
        return Mark(type=kind, n=f"{self.n}-{at}", ref=f"{kind}:{self.n}-{at}", who="agent", created=at, label=label, shows=shows,
                    **{key: value for key, value in fields.items() if value is not None})

    def marks(self) -> list[Mark]:
        return [
            *(self.mark(t["at"], t["text"], "thoughts", kind="thought") for t in self.thoughts),
            *(self.mark(c["at"], c["label"], card_shows(c.get("icon"), c.get("name", c.get("plugin"))), icon=c.get("icon"), name=c.get("name", c.get("plugin")), detail=c.get("detail"), tone=c.get("tone"),
                        color=c.get("color"), state=c.get("state"), command=c.get("command")) for c in self.cards),
            *(self.mark(sub["at"], "Refused a subagent" if sub.get("refusal") else "Dispatched a subagent", "subagents", icon="agents", name=sub["task"],
                        detail=sub["refusal"] if sub.get("refusal") else sub.get("model"), tone="danger" if sub.get("refusal") else None)
              for sub in self.subagents if "at" in sub),
            *(self.mark(sub["ended"], f"Subagent {sub.get('status', 'finished')}", "subagents", icon="agents", name=sub["task"], tone="good")
              for sub in self.subagents if sub.get("ended") and not sub.get("refusal")),
            *(self.mark(load["at"], "Loaded skill", "skills", icon="book", name=load["skill"], tone="good") for load in self.skill_loads),
            *(self.mark(done["at"], "The agent compacted its context", "compactions", icon="activity", tone="warn") for done in self.compactions),
            *(self.mark(w["at"], w.get("words", w["title"]), whisper_shows(w["ref"]), icon="reminders") for w in self.whispers),
        ]


class Waiting(TypedDict):
    ref: str
    type: str
    n: int
    title: str
    created: float


class Awaiting(TypedDict):
    text: str
    work: str
    on: str
    since: float


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
    awaiting: Awaiting


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
    delegated: bool
    helpers: list[str]
    tickets: list[int]


class Feed(TypedDict):
    items: list[dict]
    waiting: list[Waiting]
    agent: str
    notices: list[dict]
    running: Running
    plans: list[PlanStrip]


def in_feed(kind: str, row, away: list[str]) -> bool:
    if kind != "message":
        return True
    return not (row.data.get("window") or (row.data.get("acknowledgement") and "acknowledgements" in away))


def hold(home: Record) -> int:
    return AskQuestionsDetails.values(home).hold


def reaches(home: Record, phone, row) -> bool:
    if not rights_of(home).sees(home, phone.member, row):
        return False
    environment = row.data.get("environment")
    if environment in (phone.environment, None, ""):
        return True
    place = Environments(home, actor=SYSTEM).rows.by_title(environment)
    return bool(place and place.helping and place.launched_from == phone.environment)


def waiting(home: Record, phone) -> list[Waiting]:
    found = []
    for kind in WAITED:
        controller = CONTROLLERS[kind](home, actor=SYSTEM)
        for n in [row["n"] for row in controller.rows.summaries() if not row["deleted"] and not row["completed"]]:
            row = controller.load(n)
            if reaches(home, phone, row) and owed(row):
                found.append(Waiting(ref=row.ref, type=kind, n=row.n, title=row.title, created=row.created))
    return found


def feed(home: Record, phone, before: float = math.inf) -> Feed:
    away = hidden(home)
    posted = [entry(home, kind, row) for kind in POSTED for row in latest(home, kind, before, away)]
    items = sorted((item for item in posted if item), key=lambda item: item["created"])[-FEED:]
    found = faces(home, {item["ref"] for item in items})
    items = [{**item, "reactions": found.get(item["ref"], [])} for item in items]
    since = items[0]["created"] if items else before
    shown = [mark for mark in marks(home, since) if mark["created"] < before and mark["shows"] not in away]
    tasks = task_names(home) if any(item["data"].get("sent_to") for item in items) else {}
    items = sorted([*({**item, "to": tasks.get(item["data"].get("sent_to"))} for item in items), *shown], key=lambda item: item["created"])
    return Feed(items=items, waiting=waiting(home, phone), agent=Agents(home, actor=SYSTEM).state(phone.environment), notices=notices(home),
                running=running(home, phone.environment), plans=plan_strips(home))


def plan_strips(home: Record) -> list[PlanStrip]:
    plans = Plans(home, actor=SYSTEM)
    return [plan_strip(home, plans, plan) for plan in sorted(plans._running(), key=lambda plan: (plan.delegated, plan.n))]


def plan_strip(home: Record, plans: Plans, plan) -> PlanStrip:
    phases = [PlanPhase(title=formatted(phase[PHASE.title], home, VIEWER), checkpoint=bool(phase[PHASE.checkpoint]),
                        todos=[PlanTodo(n=row.n, title=formatted(row.title, home, VIEWER), done=bool(row.completed)) for row in plans._members(phase)])
              for phase in plan.phases]
    open_rows = [row for row in plans._members(plan.current_phase) if not row.completed] if plan.delegated and plan.current_phase else []
    helpers = Helpers(home, actor=SYSTEM)
    names = sorted({helpers.load(int(row.assigned.partition(":")[2])).name for row in open_rows if row.assigned.startswith("helper:")})
    return PlanStrip(n=plan.n, title=formatted(plan.title, home, VIEWER), abstract=formatted(plan.abstract, home, VIEWER), status=plan.status,
                     current=plan.current, updated=plan.updated, phases=phases, hold=hold(home), delegated=plan.delegated, helpers=names,
                     tickets=[row.n for row in open_rows if row.type == "ticket"])


def marks(home: Record, since: float) -> list[Mark]:
    agents = Agents(home, actor=SYSTEM)
    rows = [shaped(agents.load(row["n"]), home, VIEWER) for row in agents.rows.summaries() if not row["deleted"] and row["updated"] >= since]
    found = [made for row in rows if not row["data"].get("parent") for made in Session.from_view(row).marks()]
    return [made for made in found if made["created"] >= since]


def faces(home: Record, refs: set[str]) -> dict[str, list[dict]]:
    reactions = Reactions(home, actor=SYSTEM)
    found: dict[str, list[dict]] = {}
    for n in [row["n"] for row in reactions.rows.summaries() if not row["deleted"] and set(row.get("refs", [])) & refs]:
        made = reactions.load(n)
        for ref in set(made.refs) & refs:
            found.setdefault(ref, []).append({"face": made.face, "who": made.author})
    return found


def latest(home: Record, kind: str, before: float, away: list[str]) -> list:
    rows = POSTED[kind](home, actor=SYSTEM)
    loaded = (rows.load(row["n"]) for row in reversed(rows.rows.summaries()) if not row["deleted"])
    return list(islice((row for row in loaded if row.created < before and in_feed(kind, row, away)), FEED))[::-1]


def entry(home: Record, kind: str, row) -> dict:
    item = {**shaped(row, home, VIEWER), "who": "agent" if kind in ASKED or not row.seen else row.author, "files": dict(row.files)}
    return {**item, **EXTRAS.get(kind, lambda _: {})(home)}


EXTRAS = {"question": lambda home: {"hold": hold(home)},
          "suggestion": lambda home: {"window_after": SuggestionsDetails.values(home).window_after}}


def awaited(home: Record) -> Awaiting:
    work = next((w for w in Works(home, actor=SYSTEM).rows.standing() if w.awaiting and not w.parked), None)
    if work is None:
        return Awaiting(text="", work="", on="", since=0.0)
    named = f"to-do {work.todo} · {work.title}" if work.todo else work.title
    return Awaiting(text=work.awaiting, work=named, on=work.awaiting_on, since=float(work.awaiting_since))


def running(home: Record, environment: str) -> Running:
    holder = Sessions(home.root).holder(environment)
    row = Agents(home, actor=SYSTEM).rows.by_title(holder) if holder else None
    summary = lately_summarized(home.root)
    shared = dict(state=Agents(home, actor=SYSTEM).state(environment), prompt=prompt(summary, environment), auto=automatic(home), mode=mode_of(home),
                  helpers=helpers_of(home, summary), subagents=subagents_of(home, subagents(Agents(home, actor=SYSTEM).primary())), awaiting=awaited(home))
    if row is None:
        return Running(paused=False, context=0, usage=[], **shared)
    return Running(paused=bool(row.paused), context=int(row.context), usage=list(row.usage.get("windows", [])), **shared)


def prompt(summary: JournalSummary, environment: str) -> str:
    here = next((HelperSnapshot.from_payload(found) for found in summary["environments"] if found.get("name") == environment), HelperSnapshot())
    return asked_permission(here)


def helpers_of(home: Record, summary: JournalSummary) -> list[dict]:
    environments = list(map(HelperSnapshot.from_payload, summary["helpers"]))
    now = time.time()
    found = []
    for row in Helpers(home, actor=SYSTEM).all(completed=True, last=HELPERS_SHOWN):
        environment = next((one for one in environments if one.owner == row.ref), HelperSnapshot())
        agent = environment.agent
        todo = helper_todo(home, environment)
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


def helper_todo(home: Record, environment: HelperSnapshot) -> HelperTodo:
    if not environment.todo:
        return {}
    record = Record(home.root, environment.name)
    row = Todos(record, actor=SYSTEM).load(environment.todo)
    view = shaped(row, record, VIEWER)
    return {"n": row.n, "title": view["title"], "completed": row.completed}


def subagents_of(home: Record, rows: list[dict]) -> list[dict]:
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


def helper(home: Record, phone, n: int) -> dict:
    row = Helpers(home, actor=SYSTEM).load(n)
    if not reaches(home, phone, row):
        raise Refused(f"helper {n} is not in this phone's environment")
    summary = lately_summarized(home.root)
    payload = next((found for found in summary["helpers"] if found["owner"] == row.ref), {})
    environment = HelperSnapshot.from_payload(payload)
    shown = next(found for found in helpers_of(home, summary) if found["n"] == n)
    record = Record(home.root, row.environment)
    agent = Agents(record, actor=SYSTEM).primary()
    activity = [] if agent is None else Session.from_view(shaped(agent, record, VIEWER)).marks()[-5:][::-1]
    return {**shown, "activity": activity, "running": bool(environment.agent.status and environment.agent.status != "stopped")}


def task_names(home: Record) -> dict[str, str]:
    return {sub["task_id"]: sub["task"] for row in Agents(home, actor=SYSTEM).rows.standing() for sub in row.data.get("subagent_rows") or [] if sub.get("task_id")}


def notices(home: Record) -> list[dict]:
    return [shaped(row, home, VIEWER) for row in Notices(home, actor=SYSTEM).rows.standing() if not row.data.get("agent")]

