import time
from dataclasses import asdict, dataclass
from pathlib import Path

from controllers.types import Agents, Questions, Todos, Works
from engine import bus
from engine.record import Record
from engine.sessions import Sessions, live
from engine.wording import clipped
from engine.worktree import spread
from features.boards.controller import Boards
from features.boards.resource import REVIEW
from features.kanban.shapes import BoardLanes, Card, Lane
from features.tickets.landing import Landing
from features.tickets.resource import PROPOSED
from resources.base import SYSTEM, Refused
from resources.shapes import LEVELS
from resources.types import IDLE
from controllers.marks import action
from engine.extension import Extension

SILENT_AFTER = 300.0
CARD_EXTRAS = Extension()
REPOSITORY_STATES: dict = {}
LOOK_AGAIN_AFTER = 30
STATES_KEPT = 500


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
class TicketStatus:
    kind: str
    state: str
    plan: str = ""
    done: int = 0
    total: int = 0
    now: str = ""


@dataclass(frozen=True)
class Slots:
    running: list
    limit: int
    queued: int
    waiting: int


RUN_TEXT = 60


class TicketCards:
    @action
    def board(self, n: int) -> dict:
        stages = self._stages(n)
        tickets = sorted((r for r in self.rows.standing(closed_since=1) if int(r.board) == int(n) and not r.draft), key=lambda r: r.position)
        sessions = Sessions(self.record.root).all()
        running = self._running()
        lanes = BoardLanes([(Lane(stage, stage), [self._card(r, stage, stages, sessions, len(running)) for r in tickets if r.stage == stage])
                            for stage in stages], [])
        board = Boards(self.record, actor=self.actor).load(n)
        asked = Questions(self.record, actor=self.actor).about(board.ref)
        return {**lanes.shaped(), "slots": asdict(self._slots(running, sessions)), "roles": self._roles(), "questions": asked,
                "drafting": board.drafting, "expected": board.expected}

    @action
    def status(self, n: int) -> dict:
        """Where a ticket stands: its plan with the progress of its rows, what its agent does now, and whether it works or awaits."""
        from features.plans.progress import counts
        ticket = self.load(n)
        state = self._runtime(ticket, Sessions(self.record.root).all(), len(self._running()))
        if not ticket.work_environment:
            return asdict(TicketStatus(state.kind, state.text))
        place = self.record.sibling(ticket.work_environment)
        plan = self._plan_of(ticket)
        done, total = counts(place, plan) if plan else (0, 0)
        doing = next((w.title for w in Works(place, actor=SYSTEM).rows.standing() if not w.parked), "")
        return asdict(TicketStatus(state.kind, state.text, plan.title if plan else "", done, total, doing))

    def _roles(self) -> list:
        from engine.organization import organization
        try:
            found = organization(self.record.root.parent)
        except Refused:
            return []
        working = self._role_work()
        return [{"name": f"{domain.name}/{role.name}", "title": role.title or role.name, "domain": domain.name, "domain_title": domain.title or domain.name,
                 "tickets": working.get((domain.name, role.name), [])} for domain in found.domains for role in domain.roles]

    def _role_work(self) -> dict:
        working: dict = {}
        for place, ticket in {ticket.work_environment: ticket for ticket in self._running()}.items():
            plan = self._plan_owner(place)
            shown = {"plan": plan, "title": self._plans_here().load(plan).title} if plan else {"plan": 0, "title": ticket.title}
            todos = Todos(self.record.sibling(place), actor=SYSTEM)
            for todo in todos.rows.standing():
                if todo.data.get("role") and todo.data.get("status") == "started":
                    working.setdefault((todo.data["domain"], todo.data["role"]), []).append(
                        {"n": ticket.n, **shown, "env": todo.data.get("role_environment", ""), "worktree": place})
        return working

    def _slots(self, running: list, sessions: dict) -> Slots:
        kinds = [self._runtime(ticket, sessions, len(running)).kind for ticket in self.rows.standing()]
        return Slots([{"n": ticket.n, "title": ticket.title, "board": int(ticket.board)} for ticket in running],
                     self._limit(), kinds.count("queued"), kinds.count("you"))

    def _card(self, ticket, stage: str, stages: list, sessions: dict, running: int) -> Card:
        extras = [extra(self.record, ticket) for extra in CARD_EXTRAS.each(self.record)]
        state = self._runtime(ticket, sessions, running)
        return Card(ticket.n, ticket.title, int(ticket.priority or LEVELS["default"]), stage, reason=state.text, state=state.kind, session=state.session, assigned=ticket.owner, targets=[s for s in stages if s != stage],
                    updated=ticket.updated, completed=ticket.completed, type=self.type,
                    actions=[*self._actions(ticket, state.session), *(action for more in extras for action in more.actions)],
                    link=next((more.link for more in extras if more.link), ""),
                    link_label=next((more.link_label for more in extras if more.link_label), ""),
                    repositories=self._repository_states(ticket))

    def _repository_states(self, ticket) -> list:
        """Where the ticket's branch stands in each repository, as the last look found it: a board answers from what is held and never runs git for its cards; a look that is due is made behind the answer."""
        if not ticket.work_environment or ticket.completed or not spread(self.record.root.parent):
            return []
        held = REPOSITORY_STATES.get((str(self.record.root), ticket.n))
        if held is None or held[0] != ticket.updated or time.time() - held[1] >= LOOK_AGAIN_AFTER:
            key = f"repository states {self.record.root}"
            bus.background(key, self._look_at_repositories)
            held = REPOSITORY_STATES.get((str(self.record.root), ticket.n))
        return held[2] if held else []

    def _look_at_repositories(self) -> None:
        """Looks at every open ticket's branch in each repository and keeps what it finds for the boards."""
        for ticket in self.rows.standing():
            if not ticket.work_environment or ticket.completed:
                continue
            held = REPOSITORY_STATES.get((str(self.record.root), ticket.n))
            if held and held[0] == ticket.updated and time.time() - held[1] < LOOK_AGAIN_AFTER:
                continue
            branch = self._branch(ticket)
            states = [{"name": name, "branch": branch, "state": Landing(place, branch, base, self._into_at(ticket, name, place)).state()}
                      for name, place, base in self._repositories(ticket)]
            REPOSITORY_STATES[str(self.record.root), ticket.n] = (ticket.updated, time.time(), states)

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
        board = self._board(ticket)
        return board.meanings.get(ticket.stage, "") if board else ""

    def _runtime(self, ticket, sessions: dict, running: int) -> CardState:
        return self.record.remembered(("card state", ticket.n, ticket.updated), lambda: self._runtime_now(ticket, sessions, running))

    def _runtime_now(self, ticket, sessions: dict, running: int) -> CardState:
        if ticket.completed:
            return CardState("done", ticket.outcome or "done")
        place = ticket.work_environment
        proposed = [ref for ref, stance in ticket.dependencies.items() if stance == PROPOSED]
        if proposed:
            return CardState("you", f"the agent proposes it waits on {', '.join(ref.replace(':', ' ') for ref in proposed)}")
        if not place:
            return CardState("draft", "a draft, waiting for your confirmation") if ticket.draft else CardState.plain()
        reviewing = self._reviewing(ticket)
        if reviewing:
            return CardState("running", f"under review ({reviewing}) in {place}")
        row = self._reporting(place, sessions)
        session = row.title if row else ""
        state = self._agent_state(ticket, row, running)
        if self._plan_waits(ticket):
            return CardState("you", f"{state.text} in {place}; its plan waits for your approval", session)
        return CardState(state.kind, f"{state.text} in {place}" + (f" · {state.age}" if state.age else ""), session)

    def _waited_run(self, row, place: str) -> str:
        awaited = next((w.awaiting for w in Works(self.record.sibling(place), actor=SYSTEM).rows.standing() if w.awaiting), "")
        text = awaited or row.background_run
        return clipped(text, RUN_TEXT)

    def _reporting(self, place: str, sessions: dict):
        agents = Agents(self.record.sibling(place), actor=SYSTEM)
        rows = [row for name, held in sessions.items() if held.environment == place and live(held) and (row := agents.rows.by_title(name))]
        return max(rows, key=lambda row: float(row.at), default=None)

    def _agent_state(self, ticket, row, running: int) -> CardState:
        if row:
            return self._live_state(row, ticket.work_environment)
        waits = self._waiting_on(ticket)
        if waits:
            return CardState("blocked", f"waiting on {', '.join(ref.replace(':', ' ') for ref in waits)}")
        if ticket.queued:
            position = ordinal(self._queue().index(ticket.n) + 1)
            return CardState("queued", f"{position} in the queue, starts when one of {self._limit()} agents finishes" if self._limit()
                             else f"{position} in the queue, starts with the next minute's check")
        return CardState("stopped", "stopped")

    def _live_state(self, row, place: str) -> CardState:
        if row.asking:
            return CardState("you", "waiting for you")
        if not float(row.at):
            return CardState("running", "starting")
        quiet = row.quiet_for
        if row.status != IDLE and quiet > SILENT_AFTER and not row.command_running and not row.background_run:
            return CardState("you", f"silent for {int(quiet // 60)}m")
        if row.status == IDLE and quiet > SILENT_AFTER and not row.background_run:
            return CardState("you", f"idle for {int(quiet // 60)}m with nothing running in the background")
        waiting = self._waited_run(row, place) if row.status == IDLE else ""
        if waiting:
            return CardState("running", f"waiting on its run: {waiting}", age=ago(quiet))
        step = f"{row.tool} {Path(row.file).name}".strip() if row.tool else row.status
        return CardState("running", step, age=ago(quiet))
