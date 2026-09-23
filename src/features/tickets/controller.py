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
HELD = ("rule", "doc", "tool")


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
        return BoardLanes([(Lane(stage, stage), [Card(r.n, r.title, LEVELS["default"], stage, reason=self._runtime(r, sessions),
                                                     targets=[s for s in stages if s != stage], updated=r.updated, completed=r.completed, type=self.type)
                                                for r in tickets if r.stage == stage]) for stage in stages], []).shaped()

    def _runtime(self, ticket, sessions: dict) -> str:
        place = ticket.work_environment
        if not place:
            return "a draft, waiting for your confirmation" if ticket.draft else ""
        session = next((name for name, held in sessions.items() if held.environment == place and live(held)), "")
        row = Agents(Record(self.record.root, place), actor=SYSTEM)._titled(session) if session else None
        state = "waiting for you" if row and row.asking else row.status if row else "queued" if ticket.queued else "stopped"
        waiting = ticket.plan and Plans(Record(self.record.root, place), actor=SYSTEM).load(int(ticket.plan)).status == READY
        return f"{state} in {place}" + ("; its plan waits for your approval" if waiting else "")

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
        if len(self._running()) >= int(TicketsDetails.values(self.record).running):
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
        for ticket in sorted((r for r in self._standing() if r.queued), key=lambda r: r.updated):
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
