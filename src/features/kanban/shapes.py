from dataclasses import asdict, dataclass, field


@dataclass(frozen=True)
class Lane:
    key: str
    title: str


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
    type: str = "todo"
    actions: list = field(default_factory=list)
    link: str = ""
    link_label: str = ""
    state: str = ""
    session: str = ""
    repositories: list = field(default_factory=list)


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
class BoardLanes:
    lanes: list[tuple[Lane, list[Card]]]
    agents: list[AgentChip]
    plan_hold: str | None = None

    def shaped(self) -> dict:
        return {"lanes": [{**asdict(lane), "cards": [asdict(card) for card in cards]} for lane, cards in self.lanes],
                "agents": [asdict(agent) for agent in self.agents], "plan_hold": self.plan_hold, "out": self.text()}

    def text(self) -> str:
        blocks = [] if self.plan_hold is None else [self.plan_hold]
        for lane, cards in self.lanes:
            lines = [f"  {card.n:>4}  {card.title}" + (f"  [{card.reason}]" if card.reason else "") for card in cards]
            blocks.append("\n".join([f"{lane.title} ({len(cards)})", *(lines or ["  none"])]))
        return "\n\n".join(blocks)
