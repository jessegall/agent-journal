import time
from pathlib import Path
from dataclasses import asdict, dataclass

import controllers.types as types_module
from controllers.types import Environments, Features
from engine.record import Record
from engine import typist
from engine.actors import IDLE
from engine.seats import terminal_of
from engine.state import State
from engine.stop import ask_session
from engine.worktree import keep, merged, tip
from engine.sessions import Sessions, live
from features.permission_prompts.feature import prompted
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller, internal
from features.boards.controller import Boards
from features.boards.resource import DONE, REVIEW, START
from features.kanban.board import BoardLanes, Card
from features.kanban.lanes import Lane
from features.tickets.details import TicketsDetails
from features.tickets.resource import Ticket
from controllers.types import Agents, Questions
from features.plans.controller import READY, Plans
from resources.base import AGENT, SYSTEM, Refused, Resource
from resources.shapes import LEVELS, priority_level, rank_before


PROPOSED, CONFIRMED = "proposed", "confirmed"
LAUNCHING_FOR = 60.0
SILENT_AFTER = 300.0
CARD_EXTRAS: list = []
HELD = ("rule", "doc", "tool")
QUIET_IN_TICKETS = ("dev_faults",)


def ordinal(n: int) -> str:
    return f"{n}{'th' if 10 <= n % 100 <= 20 else {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')}"


def ago(seconds: float) -> str:
    if seconds < 60:
        return f"{int(seconds)}s"
    return f"{int(seconds // 60)}m" if seconds < 3600 else f"{int(seconds // 3600)}h"


@dataclass(frozen=True)
class CardState:
    kind: str
    text: str
    session: str = ""
    age: str = ""

    @classmethod
    def plain(cls) -> "CardState":
        return cls("", "")


@dataclass(frozen=True)
class Slots:
    running: list
    limit: int
    queued: int
    waiting: int


class Tickets(Controller):
    resource = Ticket

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        source = data.pop("source", None) or self.actor
        known = self._from_source(source, data.get("source_id"))
        if known:
            return self.update(known.n, title=title, abstract=abstract or None, brief=brief or None)
        if data.get("draft") and self.actor == AGENT and Boards(self.record, actor=self.actor).cancelled_lately(data["board"]):
            self._refuse(f"the request on board {data['board']} was cancelled, so stop drafting")
        opening = self._stages(data.get("board"))[:1]
        return super().create(title, abstract, brief, source=source, **{**dict(zip(["stage"], opening)), **data})

    @internal
    def save(self, r: Resource, action: str, **event) -> Resource:
        if r.board and r.stage not in self._stages(r.board):
            raise Refused(f"board {r.board} has no stage {r.stage!r}")
        return super().save(r, action, **event)

    def board(self, n: int) -> dict:
        stages = self._stages(n)
        tickets = sorted((r for r in self._standing() if int(r.board) == int(n) and not r.draft), key=lambda r: r.position)
        sessions = Sessions(self.record.root).all()
        running = self._running()
        lanes = BoardLanes([(Lane(stage, stage), [self._card(r, stage, stages, sessions, len(running)) for r in tickets if r.stage == stage])
                            for stage in stages], [])
        board = Boards(self.record, actor=self.actor).load(int(n))
        asked = Questions(self.record, actor=self.actor).about(board.ref)
        return {**lanes.shaped(), "slots": asdict(self._slots(running, sessions)), "roles": self._roles(), "questions": asked,
                "drafting": board.drafting, "expected": board.expected}

    def _roles(self) -> list:
        from features.organization.files import organization
        try:
            found = organization(self.record.root.parent)
        except Refused:
            return []
        return [{"name": f"{domain.name}/{role.name}", "title": role.title or role.name} for domain in found.domains for role in domain.roles]

    def _slots(self, running: list, sessions: dict) -> Slots:
        kinds = [self._runtime(ticket, sessions, len(running)).kind for ticket in self._standing()]
        return Slots([{"n": ticket.n, "title": ticket.title, "board": int(ticket.board)} for ticket in running],
                     int(TicketsDetails.values(self.record).running), kinds.count("queued"), kinds.count("you"))

    def _card(self, ticket, stage: str, stages: list, sessions: dict, running: int) -> Card:
        extras = [extra(self.record, ticket) for extra in CARD_EXTRAS]
        state = self._runtime(ticket, sessions, running)
        return Card(ticket.n, ticket.title, int(ticket.priority or LEVELS["default"]), stage, reason=state.text, state=state.kind, session=state.session, assigned=ticket.owner, targets=[s for s in stages if s != stage],
                    updated=ticket.updated, completed=ticket.completed, type=self.type,
                    actions=[*self._actions(ticket, state.session), *(action for more in extras for action in more.actions)],
                    link=next((more.link for more in extras if more.link), ""),
                    link_label=next((more.link_label for more in extras if more.link_label), ""))

    def _actions(self, ticket, session: str) -> list:
        proposed = any(stance == PROPOSED for stance in ticket.dependencies.values())
        waits = self._plan_waits(ticket)
        reviewed = bool(session) and self._meaning(ticket) == REVIEW
        offers = (
            (ticket.draft, [{"label": "Confirm", "action": "confirm"}]),
            (proposed, [{"label": "Accept", "action": "accept_dependencies"}, {"label": "Decline", "action": "decline_dependencies"}]),
            (waits, [{"label": "Approve plan", "action": "approve_plan"}, {"label": "Read plan", "href": f"#/{ticket.work_environment}/plan/{ticket.plan}"}]),
            (waits and session, [{"label": "Ask for changes", "action": "tell", "note": True}]),
            (reviewed, [{"label": "Send back", "action": "send_back", "note": True}]),
            (ticket.queued and not self._waiting_on(ticket), [{"label": "Start next", "action": "start_next"}]),
        )
        return [action for applies, actions in offers if applies for action in actions]

    def _meaning(self, ticket) -> str:
        return Boards(self.record, actor=self.actor).load(int(ticket.board)).meanings.get(ticket.stage, "") if ticket.board else ""

    def tell(self, n: int, note: str):
        ticket = self.load(int(n))
        session = self.agent_session(ticket.n)
        if not session:
            self._refuse(f"{self.type} {ticket.n} has no agent running to tell")
        typist.send(self.record.root, terminal_of(self.record.root, session), f"{note.strip()}\r".encode())
        return ticket

    def send_back(self, n: int, note: str):
        ticket = self.tell(n, note)
        started = [stage for stage, meaning in Boards(self.record, actor=self.actor).load(int(ticket.board)).meanings.items() if meaning == START]
        return self.update(ticket.n, stage=started[0]) if started else ticket

    def _plan_waits(self, ticket) -> bool:
        return bool(ticket.plan) and self._plans(ticket).load(int(ticket.plan)).status == READY

    def _plans(self, ticket) -> Plans:
        return Plans(Record(self.record.root, ticket.work_environment), actor=self.actor)

    def approve_plan(self, n: int):
        ticket = self.load(int(n))
        if not self._plan_waits(ticket):
            self._refuse(f"{self.type} {ticket.n} has no plan waiting for approval")
        self._plans(ticket).approve(int(ticket.plan))
        return ticket

    def _runtime(self, ticket, sessions: dict, running: int) -> CardState:
        place = ticket.work_environment
        proposed = [ref for ref, stance in ticket.dependencies.items() if stance == PROPOSED]
        if proposed:
            return CardState("you", f"the agent proposes it waits on {', '.join(ref.replace(':', ' ') for ref in proposed)}")
        if not place:
            return CardState("draft", "a draft, waiting for your confirmation") if ticket.draft else CardState.plain()
        session = next((name for name, held in sessions.items() if held.environment == place and live(held)), "")
        row = Agents(Record(self.record.root, place), actor=SYSTEM)._titled(session) if session else None
        state = self._agent_state(ticket, row, running)
        if self._plan_waits(ticket):
            return CardState("you", f"{state.text} in {place}; its plan waits for your approval", session)
        return CardState(state.kind, f"{state.text} in {place}" + (f" · {state.age}" if state.age else ""), session)

    def _agent_state(self, ticket, row, running: int) -> CardState:
        if row:
            return self._live_state(row)
        waits = self._waiting_on(ticket)
        if waits:
            return CardState("blocked", f"waiting on {', '.join(ref.replace(':', ' ') for ref in waits)}")
        if ticket.queued:
            position = ordinal(self._queue().index(ticket.n) + 1)
            return CardState("queued", f"{position} in the queue, starts when one of {TicketsDetails.values(self.record).running} agents finishes")
        return CardState("stopped", "stopped")

    def _live_state(self, row) -> CardState:
        if row.asking:
            return CardState("you", "waiting for you")
        if not float(row.at or 0):
            return CardState("running", "starting")
        quiet = time.time() - float(row.at)
        if row.status != IDLE and quiet > SILENT_AFTER:
            return CardState("you", f"silent for {int(quiet // 60)}m")
        step = f"{row.tool} {Path(row.file).name}".strip() if row.tool else row.status
        return CardState("running", step, age=ago(quiet))

    def priority(self, n: int, value: str):
        return self.update(int(n), priority=priority_level(value))

    def bind(self, n: int):
        ticket = self.load(int(n))
        if ticket.work_environment:
            return ticket
        name = f"{self.type}-{ticket.n}"
        environments = Environments(self.record, actor=self.actor)
        if not environments._titled(name):
            environments.create(name, abstract=f"Where {self.type} {ticket.n} runs", owner=ticket.ref)
        place = Record(self.record.root, name)
        prompted(place)
        for feature in QUIET_IN_TICKETS:
            Features(place, actor=SYSTEM).switch(feature, False)
        return self.update(ticket.n, work_environment=name)

    def agent_session(self, n: int) -> str:
        ticket = self.load(int(n))
        return Sessions(self.record.root).holder(ticket.work_environment) if ticket.work_environment else ""

    def complete(self, n: int, how: str = "", yes: bool = False, **data):
        ticket = self.load(int(n))
        if ticket.work_environment and not yes and not self._merged(ticket):
            raise Refused(f"{self.type} {ticket.n}'s branch {self._branch(ticket)} is not merged: merge its pull request first, or --yes closes it anyway")
        landed = bool(ticket.work_environment) and self._merged(ticket)
        closed = super().complete(ticket.n, how, **data)
        for rows, proposal in self._proposals(closed):
            if landed:
                rows.reopen(proposal.n, f"{self.type} {closed.n}'s branch was merged")
            else:
                rows.delete(proposal.n, f"{self.type} {closed.n} closed without its branch merged")
        self._stop(closed)
        environments = Environments(self.record, actor=self.actor)
        place = environments._titled(closed.work_environment) if closed.work_environment else None
        if place:
            try:
                environments.complete(place.n, how=f"{self.type} {closed.n} closed", yes=True)
            except Refused:
                pass
        return closed

    @internal
    def hold(self, type_: str, n: int) -> None:
        owner = Environments(self.record, actor=self.actor)._titled(self.record.env)
        if owner and owner.owner.startswith(f"{self.type}:"):
            CONTROLLERS[type_](self.record, actor=self.actor).complete(n, how=f"proposed for {owner.owner.replace(':', ' ')}; it counts once that branch is merged",
                                                                      proposed_for=owner.owner)

    def _proposals(self, ticket) -> list:
        return [(rows, r) for rows in (CONTROLLERS[t](self.record, actor=self.actor) for t in HELD) for r in rows._every() if r.data.get("proposed_for") == ticket.ref]

    @internal
    def keep_branches(self) -> None:
        for ticket in (r for r in self._standing() if r.work_environment):
            keep(self.record.root.parent, ticket.work_environment, self._branch(ticket))

    @internal
    def close_merged(self) -> list:
        merged = [r for r in self._standing() if r.work_environment and self._merged(r)]
        for ticket in merged:
            finished = [stage for stage, meaning in (Boards(self.record, actor=self.actor).load(int(ticket.board)).meanings.items() if ticket.board else ()) if meaning == DONE]
            if finished:
                self.update(ticket.n, stage=finished[0])
            self.complete(ticket.n, how=f"its branch {self._branch(ticket)} was merged")
        return merged

    def _branch(self, ticket) -> str:
        from providers import DRIVERS
        return DRIVERS[ticket.agent].branch(ticket.work_environment)

    def _merged(self, ticket) -> bool:
        return merged(self.record.root.parent, self._branch(ticket), ticket.base)

    def stop(self, n: int):
        ticket = self.load(int(n))
        self._stop(ticket)
        return ticket

    def _stop(self, ticket) -> None:
        session = self.agent_session(ticket.n)
        if session:
            ask_session(self.record.root, terminal_of(self.record.root, session))

    def move(self, n: int, stage: str):
        ticket = self.load(int(n))
        starting = bool(ticket.board) and Boards(self.record, actor=self.actor).load(int(ticket.board)).meanings.get(stage.strip()) == START
        if starting:
            self._confirmed(ticket)
        moved = self.update(ticket.n, stage=stage.strip())
        return self.start(moved.n) if starting else moved

    def depend(self, n: int, on: int):
        ticket, other = self.load(int(n)), self.load(int(on))
        if ticket.ref in self._reached(other) or other.n == ticket.n:
            self._refuse(f"{ticket.ref} waiting on {other.ref} would wait on itself")
        stance = PROPOSED if self.actor == AGENT else CONFIRMED
        return self.update(ticket.n, dependencies={**ticket.dependencies, other.ref: stance})

    def accept_dependencies(self, n: int, only: str = ""):
        return self._decide_dependencies(n, kept=lambda ref: not only or ref.split(":")[-1] in only.split(","))

    def decline_dependencies(self, n: int):
        return self._decide_dependencies(n, kept=lambda ref: False)

    def _decide_dependencies(self, n: int, kept):
        if self.actor == AGENT:
            self._refuse(f"only the user accepts or declines a {self.type}'s proposed dependencies")
        ticket = self.load(int(n))
        proposed = [ref for ref, stance in ticket.dependencies.items() if stance == PROPOSED]
        decided = {ref: CONFIRMED for ref in ticket.dependencies if ref not in proposed or kept(ref)}
        return self.update(ticket.n, dependencies=decided, declined=[r for r in [*ticket.declined, *proposed] if r not in decided])

    def _reached(self, ticket) -> set:
        seen, waiting = set(), [ticket]
        while waiting:
            for ref in self._confirmed_refs(waiting.pop()):
                if ref in seen:
                    continue
                seen.add(ref)
                waiting.append(self._at(ref))
        return seen

    def _waiting_on(self, ticket) -> list:
        return [ref for ref in self._confirmed_refs(ticket) if not self._at(ref).completed]

    def _confirmed_refs(self, ticket) -> list:
        return [ref for ref, stance in ticket.dependencies.items() if stance == CONFIRMED]

    def _at(self, ref: str):
        return self.load(int(ref.split(":")[1]))

    def confirm(self, n: int):
        if self.actor == AGENT:
            self._refuse(f"only the user confirms a drafted {self.type}: they do it with its button or in the viewer")
        return self.update(int(n), draft=False)

    def start(self, n: int, agent: str | None = None):
        from engine.terminal import detached
        from providers import DRIVERS
        self._confirmed(self.load(int(n)))
        ticket = self.bind(int(n))
        ticket = self.update(ticket.n, agent=agent or ticket.agent, base=ticket.base or tip(self.record.root.parent))
        with State(self.record.root / "runtime" / "ticket-starts.json").changing():
            ticket = self.load(ticket.n)
            if self._live(ticket):
                return ticket
            if self._waiting_on(ticket) or len(self._running()) >= int(TicketsDetails.values(self.record).running):
                return self.update(ticket.n, queued=True, queued_at=ticket.queued_at or time.time())
            driver, place = DRIVERS[ticket.agent], ticket.work_environment
            earlier = Sessions(self.record.root).last(place, ticket.agent)
            args = driver.within([*driver.AUTO_ARGS], place)
            detached(self.record.root, self.record.root.parent, place, ticket.agent,
                     driver.resumed(args, earlier) if earlier else driver.prompted(args, self._kickoff(ticket)))
            return self.update(ticket.n, queued=False, queued_at=0.0, launched=time.time())

    def _kickoff(self, ticket) -> str:
        return (f"You work {ticket.ref}, {ticket.title}, in this environment and its worktree. {ticket.brief}\n"
                f"Draft a plan for it with journal plan create and link it with journal ticket update {ticket.n} --set plan=<n>. "
                f"Decide whether it waits for the user's approval: work that is risky, reaches outside the project or touches production "
                f"waits (journal plan ready and say so in the chat); other work starts at once. Hand domain work out with journal todo delegate."
                + (f" Its owner is the {ticket.owner} domain: hand its work to that domain's lead first." if ticket.owner else "")
                + (f" The user declined its proposed wait on {', '.join(ticket.declined)}: do not wait for them." if ticket.declined else "")
                + "".join(f" It came from {ref}: read that request and the questions answered on it before you plan."
                          for ref in ticket.refs if ref.startswith("message:")))

    @internal
    def start_queued(self) -> None:
        for n in self._queue():
            if self.start(n).queued:
                return

    def _queue(self) -> list:
        return [r.n for r in sorted((r for r in self._standing() if r.queued and not self._waiting_on(r)), key=lambda r: r.queued_at)]

    def queue_before(self, n: int, other: int):
        ticket, target = self.load(int(n)), self.load(int(other))
        queue = [queued for queued in self._queue() if queued != ticket.n]
        if not ticket.queued or target.n not in queue:
            self._refuse(f"only a queued {self.type} moves before another queued one")
        at = queue.index(target.n)
        before = self.load(queue[at - 1]).queued_at if at else target.queued_at - 1
        return self.update(ticket.n, queued_at=(before + target.queued_at) / 2)

    def place(self, n: int, before: int):
        ticket, target = self.load(int(n)), self.load(int(before))
        if ticket.queued and target.queued:
            return self.queue_before(ticket.n, target.n)
        column = sorted((r for r in self._standing() if r.n != ticket.n and int(r.board) == int(target.board) and r.stage == target.stage), key=lambda r: r.position)
        return self.update(ticket.n, rank=rank_before(column, target.n))

    def start_next(self, n: int):
        ticket = self.load(int(n))
        if not ticket.queued:
            self._refuse(f"{self.type} {ticket.n} is not queued")
        first = min((self.load(m).queued_at for m in self._queue()), default=time.time())
        return self.update(ticket.n, queued_at=first - 1)

    def _running(self) -> list:
        return [r for r in self._standing() if r.work_environment and self._live(r)]

    def _live(self, ticket) -> bool:
        if self.agent_session(ticket.n):
            if ticket.launched:
                self.update(ticket.n, launched=0.0)
            return True
        return time.time() - ticket.launched < LAUNCHING_FOR

    def _confirmed(self, ticket) -> None:
        if ticket.draft:
            self._refuse(f"{self.type} {ticket.n} is a draft: the user confirms it before it starts")

    def _stages(self, board) -> list:
        return Boards(self.record, actor=self.actor).load(int(board)).stages if board else []

    def _from_source(self, source: str, source_id: str | None):
        if not source_id:
            return None
        return next((r for r in self._standing() if r.source == source and r.source_id == source_id), None)


resources_module.register(Ticket)
types_module.register(Tickets)
