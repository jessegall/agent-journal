import time
from dataclasses import asdict, dataclass, field

from features.format import formatted
from features.kanban.lanes import DONE, LANES, Lane, Sources, lane_of, reason_of
from features.kanban.shifts import targets
from features.plans.controller import ACTIVE


@dataclass
class Card:
    n: int
    title: str
    priority: int
    lane: str
    reason: str = ""
    plan: dict | None = None
    assigned: str = ""
    worker: dict | None = None
    question: int = 0
    reported: bool = False
    targets: list[str] = field(default_factory=list)
    updated: float = 0.0
    completed: float = 0.0


@dataclass
class AgentChip:
    n: int
    name: str
    title: str
    status: str
    parent: str
    work: int
    todo: int
    subagents: int


@dataclass
class Board:
    lanes: list[tuple[Lane, list[Card]]]
    agents: list[AgentChip]
    plan_hold: str = ""

    def shaped(self) -> dict:
        return {"lanes": [{**asdict(lane), "cards": [asdict(card) for card in cards]} for lane, cards in self.lanes],
                "agents": [asdict(agent) for agent in self.agents], "plan_hold": self.plan_hold, "out": self.text()}

    def text(self) -> str:
        blocks = [self.plan_hold] if self.plan_hold else []
        for lane, cards in self.lanes:
            lines = [f"  {card.n:>4}  {card.title}" + (f"  [{card.reason}]" if card.reason else "") for card in cards]
            blocks.append("\n".join([f"{lane.title} ({len(cards)})", *(lines or ["  none"])]))
        return "\n\n".join(blocks)


QUIET_SUBAGENT = 20 * 60


def worker_of(work, main: str) -> dict:
    agent = str(work.data.get("agent") or "")
    return {"n": work.n, "agent": agent or main, "subagent": bool(agent), "parked": bool(work.parked)}


def card_of(sources: Sources, todo, main: str = "") -> Card:
    placement = sources.placement(todo)
    work = sources.works.get(todo.n)
    record = sources.todos.record
    return Card(todo.n, formatted(todo.title, record), int(todo.priority or 100), lane_of(sources, todo), formatted(reason_of(sources, todo), record),
                {"n": placement.n, "title": placement.title, "phase": placement.phase} if placement else None,
                str(todo.assigned or ""), worker_of(work, main) if work else None, sources.questions.get(todo.n, 0),
                bool(todo.reported) and not todo.completed, targets(sources, todo), float(todo.updated or 0), float(todo.completed or 0))


def sources_of(journal) -> Sources:
    works = {int(w.todo): w for w in journal.works._standing() if w.todo}
    questions = {int(ref.split(":")[1]): q.n for q in journal.questions._standing() for ref in q.refs if ref.startswith("todo:")}
    return Sources(journal.todos, works, questions, journal.plans._every())


def build(journal, done_days: float, plan: int = 0, agent: str = "") -> Board:
    sources = sources_of(journal)
    works, plans = sources.works, sources.plans
    since = time.time() - float(done_days) * 86400
    rows = [t for t in journal.todos._every() if not t.completed or (not t.struck and float(t.completed) >= since)]
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
    hold = f"Plan {active.n} is active: rows outside it wait unless they are critical" if active else ""
    return Board(lanes, agents_of(journal, works, main, {c.assigned for c in cards if c.assigned}), hold)


def main_agent(journal) -> str:
    row = journal.agents.primary()
    return row.title if row else ""


def agents_of(journal, works: dict, main: str, assigned: set) -> list[AgentChip]:
    chips = []
    for row in journal.agents._standing():
        name = str(row.data.get("agent") or row.title)
        held = min((w for w in works.values() if worker_of(w, main)["agent"] == name), key=lambda w: bool(w.parked), default=None)
        subagent = row.status == "subagent" or bool(row.parent)
        quiet = time.time() - float(row.updated or 0) > QUIET_SUBAGENT
        if row.status == "stopped" or (name != main and not subagent) or (subagent and quiet and not held and name not in assigned):
            continue
        chips.append(AgentChip(row.n, name, "Main agent" if name == main else name, "subagent" if subagent else str(row.status or ""),
                               str(row.parent or ""), held.n if held else 0, int(held.todo) if held else 0, int(row.subagents or 0)))
    return chips
