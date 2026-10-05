import re
import time
from dataclasses import asdict, dataclass

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.types import Docs, Environments, Todos, Works
from features.plans.resource import (
    ABANDONED, ACTIVE, APPROVED, BUILDING, DONE, DRAFT, ENDED, PARKED, PHASE, PHASE_FIELDS, READY, RUNNING, WAITING, Plan,
)
from features.work_tracking.auto import passes_checkpoints
from resources.base import AGENT, SECTION, SYSTEM, Refused, check_title
from resources.shapes import LEVELS
from controllers.marks import action
from engine.extension import Extension

LOGGED = re.compile(r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}")
CHECKPOINT = re.compile(r"\s*\(checkpoint\)\s*$", re.IGNORECASE)
PHASE_ROWS = Extension()
PHASE_STARTS = Extension()
PLAN_STARTS = Extension()
PHASES, TODOS = "phases", "todos"
STAGES = (PHASES, TODOS)
DEPTHS = {
    "normal": "Write a good plan at the normal depth: the phases and the rows that matter, not every detail.",
    "thorough": "The user asked for a thorough plan: research every part before you write it and file a to-do for every "
                "small thing, down to the details, so nothing is left to the imagination.",
}


@dataclass(frozen=True)
class Moment:
    at: float
    kind: str
    todo: int
    title: str
    text: str

    @classmethod
    def of(cls, todo, at: float, kind: str, text: str) -> "Moment":
        return cls(at, kind, todo.n, todo.title, text)


def logged_at(part: dict, fallback: float) -> float:
    stamp = LOGGED.search(part[SECTION.title])
    return time.mktime(time.strptime(stamp[0], "%Y-%m-%d %H:%M")) if stamp else fallback


def status_after(last: bool, waits: bool) -> str:
    if last:
        return DONE
    if waits:
        return WAITING
    return ACTIVE


class Plans(Controller):
    resource = Plan

    def _finished(self, r) -> bool:
        return r.status in ENDED

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        if data.get("depth", "normal") not in DEPTHS:
            self._refuse(f"a plan's depth is {' or '.join(DEPTHS)}")
        return super().create(title, abstract, brief, status=BUILDING, stage=PHASES, phases=[], current=1, **data)

    @action
    def from_doc(self, doc: int):
        from features.templates.shipped import MUST_HAVE
        source = Docs(self.record, actor=self.actor).load(doc)
        must = next((s[SECTION.body] for s in source.sections if s[SECTION.title].lower() == MUST_HAVE.lower()), "")
        brief = (f"Built from the functional design, doc {source.n}. Every row names the must-have points it covers, and the plan is "
                 f"done when every point is covered.") if must else source.brief
        plan = self.create(source.title, brief=brief, goal=source.abstract or source.title)
        if must:
            self.section(plan.n, MUST_HAVE, must)
        for s in source.sections:
            if s[SECTION.title].lower().startswith("phase"):
                self.phase(plan.n, s[SECTION.title].split(":", 1)[-1].split("—", 1)[-1].strip() or s[SECTION.title], brief=s[SECTION.body])
        return self.link(plan.n, source.ref)

    @action
    def stage(self, n: int, at: str):
        if at not in STAGES:
            raise Refused(f"a plan is written in stages: {' or '.join(STAGES)}")
        return self.update(n, stage=at)

    @action
    def phases(self, n: int) -> list[dict]:
        return self.load(n).phases

    def add_part(self, n: int, title: str, body: str):
        return self.phase(n, CHECKPOINT.sub("", title), when=body, checkpoint=bool(CHECKPOINT.search(title)))

    @action
    def phase(self, n: int, title: str, when: str | None = None, checkpoint: bool = False, brief: str = "", before: int = 0):
        r = self.load(n)
        if before and not 1 <= int(before) <= len(r.phases) + 1:
            raise Refused(f"plan {r.n} has no phase {before}")
        made = {PHASE.title: check_title(title), PHASE.when: check_title(when) if when is not None else "", PHASE.checkpoint: bool(checkpoint), PHASE.brief: brief, PHASE.todos: []}
        r.phases.insert(int(before) - 1 if before else len(r.phases), made)
        return self.save(r, "updated", phase=r.phases.index(made) + 1)

    @action
    def rephrase(self, n: int, p: int, title: str | None = None, when: str | None = None, checkpoint: bool | None = None, brief: str | None = None):
        r = self.load(n)
        phase = self._phase(r, p)
        for key, value in ((PHASE.title, title), (PHASE.when, when), (PHASE.checkpoint, checkpoint), (PHASE.brief, brief)):
            if value is not None:
                phase[key] = check_title(value) if key in (PHASE.title, PHASE.when) and value else value
        return self.save(r, "updated", phase=int(p))

    @action
    def place(self, n: int, p: int, todos: list, move: bool = False, off: bool = False):
        return self._placed(n, p, "todo", todos, move, off)

    @action
    def tickets(self, n: int, p: int, tickets: list, move: bool = False, off: bool = False):
        return self._placed(n, p, "ticket", tickets, move, off)

    def _placed(self, n: int, p: int, kind: str, numbers: list, move: bool, off: bool):
        r = self.load(n)
        phase = self._phase(r, p)
        key = PHASE_FIELDS[kind]
        for ph in r.phases:
            ph.setdefault(key, [])
        for t in (int(x) for x in numbers):
            elsewhere = r.phase_of(kind, t)
            if off:
                phase[key] = [x for x in phase[key] if x != t]
                continue
            if elsewhere and elsewhere != int(p) and not move:
                self._refuse(f"{kind} {t} already sits in phase {elsewhere} of plan {n}; --move takes it out of there")
            for ph in r.phases:
                ph[key] = [x for x in ph[key] if x != t]
            phase[key].append(t)
        for t in numbers:
            ref = f"{kind}:{int(t)}"
            r.refs = [x for x in r.refs if x != ref] if off else r.refs + [ref] * (ref not in r.refs)
        return self.save(r, "linked", phase=int(p), **{key: [int(t) for t in numbers]}, off=off)

    @action
    def build(self, n: int):
        return self._status(self.load(n), BUILDING, READY, DRAFT)

    @action
    def ready(self, n: int):
        r = self.load(n)
        empty = r.empty_phases()
        if empty:
            self._refuse(f"plan {n} cannot be ready: phase {empty[0]} has no to-dos or tickets")
        return self._status(r, READY, BUILDING, DRAFT)

    @action
    def approve(self, n: int):
        self._user_only("approve")
        return self._status(self.load(n), APPROVED, DRAFT, READY)

    @action
    def start(self, n: int):
        r = self.load(n)
        if r.status in (DRAFT, READY):
            self._refuse(f"plan {n} waits for the user to approve it")
        self._allowed(r, ACTIVE, APPROVED, PARKED)
        first_start = r.status == APPROVED
        for other in self.rows.every():
            if other.n != r.n and other.status in RUNNING:
                self._status(self.load(other.n), PARKED, *RUNNING, parked_for=r.n)
        started = self._status(r, ACTIVE, APPROVED, PARKED)
        if first_start:
            for begin in PLAN_STARTS.each(self.record):
                begin(self.record, started)
        self._start_phase(started)
        return started

    @action
    def dismiss(self, n: int):
        return self.update(int(n), dismissed=True)

    @action
    def park(self, n: int):
        return self._status(self.load(n), PARKED, APPROVED, *RUNNING)

    @action
    def resume(self, n: int):
        self._user_only("continue")
        r = self.load(n)
        r.current += 1
        return self._status(r, ACTIVE, WAITING)

    @action
    def abandon(self, n: int, why: str = ""):
        return self._status(self.load(n), ABANDONED, BUILDING, DRAFT, READY, APPROVED, ACTIVE, WAITING, PARKED, why=why)

    @action
    def progress(self, n: int) -> str:
        r = self.load(n)
        lines = [f"plan {r.n}, {r.title}: {r.status}, phase {r.current} of {len(r.phases)}"]
        for i, phase in enumerate(r.phases, 1):
            rows = self._members(phase)
            closed = sum(1 for row in rows if row.completed)
            lines.append(f"{'now ' if i == r.current else ''}phase {i}, {phase[PHASE.title]}: {closed} of {len(rows)} done")
            if i == r.current:
                lines += [f"  {row.type} {row.n} {row.title}: {'done' if row.completed else row.data.get('stage') or row.data.get('status') or 'open'}"
                          for row in rows]
        lines += [f"lately: {moment['kind']} to-do {moment['todo']}, {moment['title']}" for moment in self.timeline(r.n)[-3:]]
        return "\n".join(lines)

    @action
    def timeline(self, n: int) -> list[dict]:
        r = self.load(n)
        numbers = {t for phase in r.phases for t in phase[PHASE.todos]}
        todos = {t.n: t for t in map(Todos(self.record, actor=self.actor).load, numbers)}
        works = [Works(self.record, actor=self.actor).load(row["n"]) for row in Works(self.record, actor=self.actor).rows.summaries()
                 if not row["deleted"] and row.get("todo") in numbers]
        items = [Moment.of(t, t.completed, "done", t.outcome) for t in todos.values() if t.completed]
        for work in works:
            todo = todos[work.data["todo"]]
            items.append(Moment.of(todo, work.created, "started", work.title))
            items += [Moment.of(todo, logged_at(part, work.created), "log", part[SECTION.body]) for part in work.sections]
            if work.completed:
                items.append(Moment.of(todo, work.completed, "ended", work.outcome))
        return [asdict(item) for item in sorted(items, key=lambda item: item.at)]

    def _status(self, r, to: str, *allowed: str, **event):
        self._allowed(r, to, *allowed)
        r.status = to
        return self.save(r, "updated", status=to, **event)

    def _allowed(self, r, to: str, *allowed: str) -> None:
        if r.status not in allowed:
            raise Refused(f"plan {r.n} is {r.status}, not one that can become {to}")

    def _phase(self, r, p: int) -> dict:
        if not 1 <= int(p) <= len(r.phases):
            raise Refused(f"plan {r.n} has no phase {p}")
        return r.phases[int(p) - 1]

    def _running(self) -> list:
        return [p for p in self.rows.every() if p.status in RUNNING]

    def _active(self) -> list:
        return [p for p in self.rows.every() if p.status == ACTIVE]

    def _members(self, phase: dict) -> list:
        found = []
        for key, kind in {PHASE.todos: Todos, **PHASE_ROWS.keyed()}.items():
            rows = kind(self.record, actor=self.actor)
            found += [rows.load(n) for n in phase.get(key, []) if rows.rows.exists(int(n))]
        return found

    def _complete(self, phase: dict) -> bool:
        return all(row.completed for row in self._members(phase))

    def _first_open(self, plan) -> int:
        return next((p for p, phase in enumerate(plan.phases, 1) if not self._complete(phase)), 0)

    def _holds(self, todo) -> bool:
        plans = self.rows.every()
        placements = [found for found in (plan.placement(todo) for plan in plans) if found]
        if placements:
            return all(found.holds for found in placements)
        return any(p.status == ACTIVE for p in plans) and int(todo.priority or LEVELS["default"]) < LEVELS["critical"]

    def _start_phase(self, plan) -> None:
        for start in PHASE_STARTS.each(self.record):
            start(self.record, plan)

    def _step(self, plan) -> bool:
        phase = plan.current_phase
        if plan.status != ACTIVE or phase is None or not self._complete(phase):
            return False
        i = plan.current
        last = i == len(plan.phases)
        waits = bool(phase[PHASE.checkpoint]) and not passes_checkpoints(self.record)
        plan.status = status_after(last, waits)
        plan.current = i if last or waits else i + 1
        self.save(plan, "updated", phase=i, complete=True, status=plan.status, passed=bool(phase[PHASE.checkpoint]) and not waits)
        if last:
            self.complete(plan.n, how="every row in every phase is done")
        elif not waits:
            self._start_phase(plan)
        return not (last or waits)

    def _catch_up(self) -> None:
        for running in self._running():
            plan = self.load(running.n)
            while self._step(plan):
                pass

    def _user_only(self, word: str) -> None:
        if self.actor == AGENT:
            self._refuse(f"only the user can {word} a plan: they do it in the viewer{self._orchestrator_route(word)}")

    def _orchestrator_route(self, word: str) -> str:
        place = Environments(self.record, actor=SYSTEM).rows.by_title(self.record.env)
        n = place.owned_by("ticket") if place else 0
        if not n:
            return ""
        return f". This is the plan of ticket {n}: the agent orchestrating its board does it with journal ticket {word}_plan {n}"


resources_module.register(Plan)
types_module.register(Plans)
