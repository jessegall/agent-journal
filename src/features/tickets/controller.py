from dataclasses import asdict, dataclass

import controllers.types as types_module
from controllers.types import Environments
from engine import typist
from engine.record import Record
from engine.worktree import keep, merged
from engine.sessions import Sessions, live
from features.permission_prompts.feature import prompted
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller, internal
from features.boards.controller import Boards
from features.boards.resource import DONE, START
from features.kanban.board import BoardLanes, Card
from features.kanban.lanes import Lane
from features.tickets.details import TicketsDetails
from features.tickets.resource import Ticket
from controllers.types import Agents
from features.plans.controller import READY, Plans
from resources.base import AGENT, SYSTEM, Refused, Resource
from resources.shapes import LEVELS


AGENT_CLI = "claude"
PROPOSED, CONFIRMED = "proposed", "confirmed"
CARD_EXTRAS: list = []
HELD = ("rule", "doc", "tool")


@dataclass(frozen=True)
class CardState:
    kind: str
    text: str


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
        opening = self._stages(data.get("board"))[:1]
        return super().create(title, abstract, brief, source=source, **{**dict(zip(["stage"], opening)), **data})

    @internal
    def save(self, r: Resource, action: str, **event) -> Resource:
        if r.board and r.stage not in self._stages(r.board):
            raise Refused(f"board {r.board} has no stage {r.stage!r}")
        return super().save(r, action, **event)

    def board(self, n: int) -> dict:
        stages = self._stages(n)
        tickets = [r for r in self._standing() if int(r.board) == int(n)]
        sessions = Sessions(self.record.root).all()
        running = self._running()
        lanes = BoardLanes([(Lane(stage, stage), [self._card(r, stage, stages, sessions, len(running)) for r in tickets if r.stage == stage])
                            for stage in stages], [])
        return {**lanes.shaped(), "slots": asdict(self._slots(running, sessions))}

    def _slots(self, running: list, sessions: dict) -> Slots:
        kinds = [self._runtime(ticket, sessions, len(running)).kind for ticket in self._standing()]
        return Slots([{"n": ticket.n, "title": ticket.title, "board": int(ticket.board)} for ticket in running],
                     int(TicketsDetails.values(self.record).running), kinds.count("queued"), kinds.count("you"))

    def _card(self, ticket, stage: str, stages: list, sessions: dict, running: int) -> Card:
        extras = [extra(self.record, ticket) for extra in CARD_EXTRAS]
        state = self._runtime(ticket, sessions, running)
        return Card(ticket.n, ticket.title, LEVELS["default"], stage, reason=state.text, state=state.kind, targets=[s for s in stages if s != stage],
                    updated=ticket.updated, completed=ticket.completed, type=self.type,
                    actions=[*self._actions(ticket), *(action for more in extras for action in more.actions)],
                    link=next((more.link for more in extras if more.link), ""))

    def _actions(self, ticket) -> list:
        proposed = any(stance == PROPOSED for stance in ticket.dependencies.values())
        return [*([{"label": "Confirm", "action": "confirm"}] if ticket.draft else []),
                *([{"label": "Accept", "action": "accept_dependencies"}, {"label": "Decline", "action": "decline_dependencies"}] if proposed else []),
                *([{"label": "Approve plan", "action": "approve_plan"},
                   {"label": "Read plan", "href": f"#/{ticket.work_environment}/plan/{ticket.plan}"}] if self._plan_waits(ticket) else [])]

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
            return CardState("draft", "a draft, waiting for your confirmation") if ticket.draft else CardState("", "")
        session = next((name for name, held in sessions.items() if held.environment == place and live(held)), "")
        row = Agents(Record(self.record.root, place), actor=SYSTEM)._titled(session) if session else None
        state = self._agent_state(ticket, row, running)
        if self._plan_waits(ticket):
            return CardState("you", f"{state.text} in {place}; its plan waits for your approval")
        return CardState(state.kind, f"{state.text} in {place}")

    def _agent_state(self, ticket, row, running: int) -> CardState:
        if row:
            return CardState("you", "waiting for you") if row.asking else CardState("running", row.status)
        waits = self._waiting_on(ticket)
        if waits:
            return CardState("blocked", f"waiting on {', '.join(ref.replace(':', ' ') for ref in waits)}")
        if ticket.queued:
            return CardState("queued", f"queued while {running} of {TicketsDetails.values(self.record).running} agents run")
        return CardState("stopped", "stopped")

    def bind(self, n: int):
        ticket = self.load(int(n))
        if ticket.work_environment:
            return ticket
        name = f"{self.type}-{ticket.n}"
        environments = Environments(self.record, actor=self.actor)
        if not environments._titled(name):
            environments.create(name, abstract=f"Where {self.type} {ticket.n} runs", owner=ticket.ref)
        prompted(Record(self.record.root, name))
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
        return DRIVERS[AGENT_CLI].branch(ticket.work_environment)

    def _merged(self, ticket) -> bool:
        return merged(self.record.root.parent, self._branch(ticket))

    def stop(self, n: int):
        ticket = self.load(int(n))
        self._stop(ticket)
        return ticket

    def _stop(self, ticket) -> None:
        from providers import DRIVERS
        session = self.agent_session(ticket.n)
        if session and DRIVERS[AGENT_CLI].EXIT:
            typist.send(self.record.root, session, f"{DRIVERS[AGENT_CLI].EXIT}\r".encode())

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

    def accept_dependencies(self, n: int):
        return self._decide_dependencies(n, keep=True)

    def decline_dependencies(self, n: int):
        return self._decide_dependencies(n, keep=False)

    def _decide_dependencies(self, n: int, keep: bool):
        if self.actor == AGENT:
            self._refuse(f"only the user accepts or declines a {self.type}'s proposed dependencies")
        ticket = self.load(int(n))
        decided = {ref: CONFIRMED for ref, stance in ticket.dependencies.items() if stance == CONFIRMED or keep}
        return self.update(ticket.n, dependencies=decided)

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

    def start(self, n: int, agent: str = AGENT_CLI):
        from engine.terminal import detached
        from providers import DRIVERS
        self._confirmed(self.load(int(n)))
        ticket = self.bind(int(n))
        if self.agent_session(ticket.n):
            return ticket
        if self._waiting_on(ticket) or len(self._running()) >= int(TicketsDetails.values(self.record).running):
            return self.update(ticket.n, queued=True)
        driver, place = DRIVERS[agent], ticket.work_environment
        earlier = Sessions(self.record.root).last(place, agent)
        args = driver.within([*driver.AUTO_ARGS], place)
        detached(self.record.root, self.record.root.parent, place, agent, driver.resumed(args, earlier) if earlier else driver.prompted(args, self._kickoff(ticket)))
        return self.update(ticket.n, queued=False)

    def _kickoff(self, ticket) -> str:
        return (f"You work {ticket.ref}, {ticket.title}, in this environment and its worktree. {ticket.brief}\n"
                f"Draft a plan for it with journal plan create and link it with journal ticket update {ticket.n} --set plan=<n>. "
                f"Decide whether it waits for the user's approval: work that is risky, reaches outside the project or touches production "
                f"waits (journal plan ready and say so in the chat); other work starts at once. Hand domain work out with journal todo delegate.")

    @internal
    def start_queued(self) -> None:
        for ticket in sorted((r for r in self._standing() if r.queued and not self._waiting_on(r)), key=lambda r: r.updated):
            if self.start(ticket.n).queued:
                return

    def _running(self) -> list:
        return [r for r in self._standing() if r.work_environment and self.agent_session(r.n)]

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
