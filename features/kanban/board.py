import time
from dataclasses import asdict, dataclass, field

from features.kanban.lanes import DONE, LANES, Lane, Sources, lane_of, reason_of
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
    name: str
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


def worker_of(work) -> dict:
    agent = str(work.data.get("agent") or "")
    return {"n": work.n, "agent": agent or str(work.data.get("session") or ""), "subagent": bool(agent), "parked": bool(work.parked)}


def card_of(sources: Sources, todo) -> Card:
    placement = sources.placement(todo)
    work = sources.works.get(todo.n)
    return Card(todo.n, todo.title, int(todo.priority or 100), lane_of(sources, todo), reason_of(sources, todo),
                {"n": placement.n, "title": placement.title, "phase": placement.phase} if placement else None,
                str(todo.assigned or ""), worker_of(work) if work else None, sources.questions.get(todo.n, 0),
                bool(todo.reported) and not todo.completed, [], float(todo.updated or 0), float(todo.completed or 0))


def build(journal, done_days: float, plan: int = 0, agent: str = "") -> Board:
    works = {int(w.todo): w for w in journal.works._standing() if w.todo}
    questions = {int(ref.split(":")[1]): q.n for q in journal.questions._standing() for ref in q.refs if ref.startswith("todo:")}
    plans = journal.plans._every()
    sources = Sources(journal.todos, works, questions, plans)
    since = time.time() - float(done_days) * 86400
    rows = [t for t in journal.todos._every() if not t.completed or (not t.struck and float(t.completed) >= since)]
    if plan:
        placed = next((p for p in plans if p.n == int(plan)), None)
        rows = [t for t in rows if placed and t.ref in placed.refs]
    cards = [card_of(sources, t) for t in rows]
    if agent:
        cards = [c for c in cards if c.assigned == agent or (c.worker and c.worker["agent"] == agent)]
    lanes = [(lane, [c for c in cards if c.lane == lane.key]) for lane in LANES]
    lanes = [(lane, sorted(found, key=lambda c: -c.completed) if lane.key == DONE else found) for lane, found in lanes]
    active = next((p for p in plans if p.status == ACTIVE), None)
    hold = f"Plan {active.n} is active: rows outside it wait unless they are critical" if active else ""
    return Board(lanes, agents_of(journal, works), hold)


def agents_of(journal, works: dict) -> list[AgentChip]:
    chips = []
    for row in journal.agents._standing():
        if row.status == "stopped":
            continue
        name = str(row.data.get("agent") or row.title)
        held = next((w for w in works.values() if worker_of(w)["agent"] == name), None)
        chips.append(AgentChip(name, str(row.status or ""), str(row.parent or ""), held.n if held else 0,
                               int(held.todo) if held else 0, int(row.subagents or 0)))
    return chips
