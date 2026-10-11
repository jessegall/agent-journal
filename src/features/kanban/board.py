import time
from dataclasses import dataclass
from typing import TypedDict

from controllers.stored import PAGE, cursor_of, cursor_text, paged
from controllers.todos import column_order
from resources.shapes import position_of
from features.format import formatted_item
from features.kanban.lanes import DONE, LANES, Sources, lane_of, reason_of
from features.kanban.shifts import targets
from features.plans.resource import ACTIVE
from features.trigger import DAY
from resources.base import Ref
from features.kanban.shapes import AgentChip, BoardLanes, Card, Lane
from features.plans.controller import Plans
from controllers.types import Agents, Questions, Todos, Works

DONE_SHOWN = 50
QUIET_SUBAGENT = 20 * 60


class Worker(TypedDict):
    n: int
    agent: str
    subagent: bool
    parked: bool


@dataclass(frozen=True)
class OpenTodo:
    """A to-do as the board reads it: the few fields a card shows and a lane is worked out from, taken from the row's summary, so no row is parsed for a card."""
    n: int
    title: str
    priority: int
    position: float
    assigned: str
    updated: float
    completed: float
    pending: bool
    blocked: str
    reported: bool
    struck: bool
    after: tuple[str, ...]

    @classmethod
    def of(cls, row: dict) -> "OpenTodo":
        """A card's to-do from its summary: the board asks only whether a row is held, reported or struck, so those arrive as answers rather than as the fields they are read from."""
        return cls(row["n"], row["title"], int(row["priority"]), position_of(row["rank"], row["n"]), row["assigned"], row["updated"], row["completed"],
                   bool(row["pending"]), row["blocked"], bool(row["reported"]), bool(row["struck"]), tuple(row["after"]))

    @property
    def ref(self) -> str:
        return f"todo:{self.n}"


def worker_of(work, main: str) -> Worker:
    agent = work.agent
    return {"n": work.n, "agent": agent if agent else main, "subagent": bool(agent), "parked": bool(work.parked)}


def card_of(sources: Sources, todo, main: str = "") -> Card:
    placement = sources.placement(todo)
    work = sources.works.get(todo.n)
    record = sources.todos.record
    return Card(todo.n, formatted_item(todo.title, record, ""), todo.priority, lane_of(sources, todo), formatted_item(reason_of(sources, todo), record, ""),
                {"n": placement.n, "title": placement.title, "phase": placement.phase} if placement else None,
                todo.assigned, worker_of(work, main) if work else None, sources.questions.get(todo.n, 0),
                bool(todo.reported) and not todo.completed, targets(sources, todo), todo.updated, todo.completed)


def sources_of(journal) -> Sources:
    works = {int(w.todo): w for w in journal.get(Works).rows.standing() if w.todo}
    questions = {Ref.parse(ref).n: q.n for q in journal.get(Questions).rows.standing() for ref in q.refs if ref.startswith("todo:")}
    return Sources(journal.get(Todos), works, questions, journal.get(Plans).rows.every())


def held_by(sources: Sources, todo, main: str, agent: str) -> bool:
    work = sources.works.get(todo.n)
    return todo.assigned == agent or bool(work and worker_of(work, main)["agent"] == agent)


def placed_order(lane: str):
    """Where a card stands in its lane: the done lane newest first, the others by priority then number, a key that holds still while rows are written between two pages."""
    return (lambda t: (-t.completed, t.n)) if lane == DONE else column_order


def build(journal, done_days: float, plan: int, agent: str, lane: str | None = None, after: str | None = None, size: int = PAGE, query: str | None = None, only: int = 0) -> BoardLanes:
    """The board's lanes, each its first `size` cards and how many it holds; with `lane` and `after` the cards after the cursor that lane's last page ended at, with `only` the one card of that number; cards are made for the page alone."""
    sources = sources_of(journal)
    works, plans = sources.works, sources.plans
    since = time.time() - float(done_days) * DAY
    rows = [OpenTodo.of(row) for row in journal.get(Todos).rows.kept_summaries(since, DONE_SHOWN) if not row["hidden"] and (not row["completed"] or not row["struck"])]
    if plan:
        placed = next((p for p in plans if p.n == int(plan)), None)
        rows = [t for t in rows if placed and t.ref in placed.refs]
    main = main_agent(journal)
    if agent:
        rows = [t for t in rows if held_by(sources, t, main, agent)]
    words = (query or "").strip().lower()
    if words:
        rows = [t for t in rows if words in f"#{t.n} {t.title}".lower()]
    if only:
        rows = [t for t in rows if t.n == int(only)]
    lanes, shown = [], []
    for each in LANES:
        if lane and each.key != lane:
            continue
        page = paged([t for t in rows if lane_of(sources, t) == each.key], placed_order(each.key), cursor_of(after) if each.key == lane else None, int(size))
        cards = [card_of(sources, t, main) for t in page.rows]
        shown += cards
        lanes.append((Lane(each.key, each.title, page.total, cursor_text(page.next)), cards))
    active = next((p for p in plans if p.status == ACTIVE), None)
    hold = f"Plan {active.n} is active: rows outside it wait unless they are critical" if active else None
    return BoardLanes(lanes, agents_of(journal, works, main, {c.assigned for c in shown if c.assigned}), hold)


def main_agent(journal) -> str:
    row = journal.get(Agents).primary()
    return row.title if row else ""


def agents_of(journal, works: dict, main: str, assigned: set) -> list[AgentChip]:
    chips = []
    for row in journal.get(Agents).rows.standing():
        name = row.agent if row.agent else row.title
        held = min((w for w in works.values() if worker_of(w, main)["agent"] == name), key=lambda w: bool(w.parked), default=None)
        subagent = row.subagent
        quiet = time.time() - row.updated > QUIET_SUBAGENT
        if row.status == "stopped" or (name != main and not subagent) or (subagent and quiet and not held and name not in assigned):
            continue
        chips.append(AgentChip(row.n, name, "Main agent" if name == main else name, "subagent" if subagent else row.status,
                               row.parent, held.n if held else 0, int(held.todo) if held else 0, int(row.subagents)))
    return chips
