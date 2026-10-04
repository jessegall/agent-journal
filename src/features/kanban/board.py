import time
from typing import TypedDict

from features.format import formatted
from features.kanban.lanes import DONE, LANES, Sources, lane_of, reason_of
from features.kanban.shifts import targets
from features.plans.resource import ACTIVE
from features.trigger import DAY
from resources.base import Ref
from surfaces.board import AgentChip, BoardLanes, Card

DONE_SHOWN = 50
QUIET_SUBAGENT = 20 * 60


class Worker(TypedDict):
    n: int
    agent: str
    subagent: bool
    parked: bool


def worker_of(work, main: str) -> Worker:
    agent = work.agent
    return {"n": work.n, "agent": agent if agent else main, "subagent": bool(agent), "parked": bool(work.parked)}


def card_of(sources: Sources, todo, main: str = "") -> Card:
    placement = sources.placement(todo)
    work = sources.works.get(todo.n)
    record = sources.todos.record
    return Card(todo.n, formatted(todo.title, record), int(todo.priority or 100), lane_of(sources, todo), formatted(reason_of(sources, todo), record),
                {"n": placement.n, "title": placement.title, "phase": placement.phase} if placement else None,
                todo.assigned, worker_of(work, main) if work else None, sources.questions.get(todo.n, 0),
                bool(todo.reported) and not todo.completed, targets(sources, todo), todo.updated, todo.completed)


def sources_of(journal) -> Sources:
    works = {int(w.todo): w for w in journal.works._standing() if w.todo}
    questions = {Ref.parse(ref).n: q.n for q in journal.questions._standing() for ref in q.refs if ref.startswith("todo:")}
    return Sources(journal.todos, works, questions, journal.plans._every())


def build(journal, done_days: float, plan: int, agent: str) -> BoardLanes:
    sources = sources_of(journal)
    works, plans = sources.works, sources.plans
    since = time.time() - float(done_days) * DAY
    rows = [t for t in journal.todos._standing(closed_since=since, closed_last=DONE_SHOWN) if not t.completed or not t.struck]
    if plan:
        placed = next((p for p in plans if p.n == int(plan)), None)
        rows = [t for t in rows if placed and t.ref in placed.refs]
    main = main_agent(journal)
    cards = [card_of(sources, t, main) for t in rows]
    if agent:
        cards = [c for c in cards if c.assigned == agent or (c.worker and c.worker["agent"] == agent)]
    lanes = [(lane, [c for c in cards if c.lane == lane.key]) for lane in LANES]
    lanes = [(lane, sorted(found, key=lambda c: -c.completed) if lane.key == DONE else found) for lane, found in lanes]
    active = next((p for p in plans if p.status == ACTIVE), None)
    hold = f"Plan {active.n} is active: rows outside it wait unless they are critical" if active else None
    return BoardLanes(lanes, agents_of(journal, works, main, {c.assigned for c in cards if c.assigned}), hold)


def main_agent(journal) -> str:
    row = journal.agents.primary()
    return row.title if row else ""


def agents_of(journal, works: dict, main: str, assigned: set) -> list[AgentChip]:
    chips = []
    for row in journal.agents._standing():
        name = row.agent if row.agent else row.title
        held = min((w for w in works.values() if worker_of(w, main)["agent"] == name), key=lambda w: bool(w.parked), default=None)
        subagent = row.subagent
        quiet = time.time() - row.updated > QUIET_SUBAGENT
        if row.status == "stopped" or (name != main and not subagent) or (subagent and quiet and not held and name not in assigned):
            continue
        chips.append(AgentChip(row.n, name, "Main agent" if name == main else name, "subagent" if subagent else row.status,
                               row.parent, held.n if held else 0, int(held.todo) if held else 0, int(row.subagents)))
    return chips
