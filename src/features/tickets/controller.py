import time

import controllers.types as types_module
from controllers.agents import IDLE_STATE, WORKING_STATE
from controllers.types import Agents, Environments, Features, Messages
from engine import bus
from engine.record import Record
from engine.seats import terminal_of
from engine.state import State
from engine.stop import ask_session
from engine.worktree import branched, changed, current_branch, keep_own_packages, merged_into, present, tip
from engine.sessions import Sessions, live
from features.permission_prompts.skipping import prompted
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller, discarding
from controllers.prioritised import Prioritised
from controllers.requests import request
from engine.outbox import Request
from engine.given import given
from features.boards.controller import Boards
from features.boards.resource import DONE, REVIEW, START
from features.checks.output import tail
from engine.proc import streamed
from features.tickets.cards import CardState, TicketCards
from features.tickets.details import TicketsDetails
from features.tickets.landing import TicketLanding
from features.tickets.orchestration import DRAFTS, PLANS, WAITS, TicketOrchestration
from features.tickets.resource import CONFIRMED, PROPOSED, Ticket, card_back
from controllers.types import Comments
from features.plans.controller import ACTIVE, DONE as PLAN_DONE, READY, WAITING, Plans
from resources.base import AGENT, ESCALATED, Refused, Resource, SYSTEM, USER, titled
from resources.shapes import rank_before
from controllers.marks import action
from resources.types import EnvironmentKind

LAUNCHING_FOR = 60.0
STOP_WAIT, STOP_POLL = 20.0, 0.25
TELL_GRACE = 60.0
RETURNS_BEFORE_ESCALATING = 2
RELEASE_TIMEOUT = 600
HELD = ("rule", "doc", "tool")
QUIET_IN_TICKETS = ("dev_faults",)
CARRY_ON = "Carry on with {ref} where you left off."
HANDED = ("{ref}, {title}, is yours to do in this worktree, after the tickets you already have: {brief} Read it with journal "
          "ticket show {n}, commit it on this branch, and say when it is done.")
MOST_RESTARTS = 1
BUILD_AGAIN = 600.0
SCREEN_LINES, SCREEN_BYTES = 40, 32768
NEEDS_A_LOOK = ("you", "stopped")


class Tickets(TicketCards, TicketLanding, TicketOrchestration, Prioritised, Controller):
    resource = Ticket

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        source = data.pop("source", None) or self.actor
        known = self._from_source(source, data.get("source_id"))
        if known:
            return self.update(known.n, title=title, abstract=abstract or None, brief=brief or None)
        if data.get("draft") and self.actor == AGENT and Boards(self.record, actor=self.actor).cancelled_lately(data["board"]):
            self._refuse(f"the request on board {data['board']} was cancelled, so stop drafting")
        after = [word.strip() for word in str(data.pop("after", "")).split(",") if word.strip()]
        unknown = [word for word in after if not word.isdigit() or not self.rows.exists(int(word))]
        if unknown:
            self._refuse(f"a card waits only on cards already made; not {', '.join(unknown)}")
        if isinstance(data.get("covers"), int):
            data["covers"] = [str(data["covers"])]
        opening = self._stages(data.get("board"))[:1]
        made = super().create(title, abstract, card_back(brief), source=source, **{**dict(zip(["stage"], opening)), **data})
        for other in after:
            made = self.depend(made.n, int(other))
        return made

    def _kept_from_outside(self, r: Resource) -> None:
        """An agent can neither mark a ticket from an integration as started by you nor change where it came from."""
        stored = self._stored(r) if self.rows.exists(r.n) else None
        if self.actor != AGENT or stored is None or not self._from_outside(stored):
            return
        if r.source != stored.source or (r.data.get("user_started") and not stored.data.get("user_started")):
            self._refuse(f"only you start or change the source of a ticket from {stored.source}, in the viewer")

    @discarding
    def save(self, r: Resource, action: str, **event) -> Resource:
        from providers import DRIVERS
        self._kept_from_outside(r)
        if r.board and r.stage not in self._stages(r.board):
            raise Refused(f"board {r.board} has no stage {r.stage!r}")
        if r.provider not in DRIVERS:
            raise Refused(f"no provider {r.provider!r}; one of {', '.join(DRIVERS)}")
        return super().save(r, action, **event)

    def _limit(self) -> int:
        return max(0, int(TicketsDetails.values(self.record).running))

    @action
    def tell(self, n: int, note: str) -> str:
        ticket = self._told(n, note)
        return f"told {self.type} {ticket.n}'s agent: {note.strip()[:200]}"

    def _told(self, n: int, note: str):
        ticket = self.load(n)
        driver = self._driver(ticket, "tell")
        if self._working(ticket):
            Messages(Record(self.record.root, ticket.work_environment), actor=AGENT).create(titled(note), brief=note.strip(), from_main=True)
        elif not (driver.send(note.strip(), now=True) or driver.send(note.strip(), now=True, by=self.record.env)):
            self._refuse(f"the note to {self.type} {ticket.n}'s agent stayed in its input box; its agent may be stuck")
        return self.update(ticket.n, told=time.time())

    @action
    def screen(self, n: int, lines: int = SCREEN_LINES) -> str:
        ticket = self.load(n)
        shown = [line.rstrip() for line in self._driver(ticket, "look at").screen(SCREEN_BYTES).replace("\r", "\n").splitlines() if line.strip()]
        return "\n".join(shown[-int(lines):])

    def _driver(self, ticket, doing: str):
        from providers import DRIVERS
        session = self.agent_session(ticket.n)
        if not session:
            self._refuse(f"{self.type} {ticket.n} has no agent running to {doing}")
        return DRIVERS[ticket.provider](Record(self.record.root, ticket.work_environment), terminal_of(self.record.root, session))

    def _build_approved_plans(self) -> None:
        """A ticket agent that stands idle with a plan approved is told to build it: through the journal's channel first, which a prompt that does not take typed text still hears; once in ten minutes."""
        for ticket in self.rows.standing():
            if not ticket.work_environment or not ticket.plan or time.time() - ticket.told < BUILD_AGAIN:
                continue
            if not self.agent_session(ticket.n) or self._plan_status(ticket) != ACTIVE or Agents(self.record, actor=SYSTEM).state(ticket.work_environment) != IDLE_STATE:
                continue
            try:
                self._told(ticket.n, f"Build your approved plan: journal plan progress {ticket.plan} says where it stands. {ticket.brief.strip()[:600]}")
            except Refused:
                continue

    def _ask_to_stop(self, session: str) -> None:
        ask_session(self.record.root, terminal_of(self.record.root, session))

    @action
    def send_back(self, n: int, note: str):
        ticket = self._told(n, note)
        ticket = self.update(ticket.n, sent_back=int(ticket.sent_back) + 1, **given(stage=self._board(ticket).stage_for(START)))
        if ticket.sent_back >= RETURNS_BEFORE_ESCALATING:
            self._emit(ticket.n, ESCALATED)
        return ticket

    def _plan_of(self, ticket):
        """The plan a ticket points at, or nothing when that row is not in its environment, so a missing plan stops nothing."""
        if not (ticket.plan and ticket.work_environment):
            return None
        plans = self._plans(ticket)
        return plans.load(ticket.plan) if plans.rows.exists(ticket.plan) else None

    def _plans(self, ticket) -> Plans:
        return Plans(self.record.sibling(ticket.work_environment), actor=self.actor)

    @action
    def approve_plan(self, n: int):
        ticket = self.load(n)
        waits = self._waiting_on(ticket)
        if waits and self._plan_status(ticket) == READY and self._may_decide(ticket):
            return self.update(ticket.n, approved_early=True)
        if waits:
            self._refuse(f"{self.type} {n} waits on {', '.join(ref.replace(':', ' ') for ref in waits)}: its plan is approved once they are merged")
        return self._decide_plan(n, READY, "approve", "approve", "")

    def _may_decide(self, ticket) -> bool:
        """Whether whoever acts may approve this ticket's plan: the user always, an agent only as the orchestrator of a board that lets it."""
        return self.actor != AGENT or (self._orchestrator_may(ticket, PLANS) and int(ticket.board) in self._orchestrating())

    def _apply_early_approvals(self) -> None:
        """A plan approved while its ticket waited is approved the moment the wait ends."""
        for ticket in [r for r in self.rows.standing() if r.approved_early and r.work_environment and not self._waiting_on(r)]:
            self.update(ticket.n, approved_early=False)
            try:
                Tickets(self.record, actor=SYSTEM)._decide_plan(ticket.n, READY, "approve", "approve", "")
            except Refused:
                continue

    @action
    def continue_plan(self, n: int):
        return self._decide_plan(n, WAITING, "continue", "resume", "is past its checkpoint: carry on with its next phase.")

    def _decide_plan(self, n: int, status: str, word: str, method: str, told: str):
        ticket = self.load(n)
        if self._plan_status(ticket) != status:
            self._refuse(f"{self.type} {ticket.n} has no plan waiting for you to {word}")
        if self.actor != AGENT:
            request(self.record.root, Request(ticket.work_environment, Plans.resource.type, method, [int(ticket.plan)], actor=self.actor))
            return ticket
        if not self._orchestrator_may(ticket, PLANS) or int(ticket.board) not in self._orchestrating():
            self._refuse(self._refusal(ticket, PLANS, f"{word} the plan of {self.type} {ticket.n}"))
        request(self.record.root, Request(ticket.work_environment, Plans.resource.type, method, [int(ticket.plan)]))
        if told and self.agent_session(ticket.n):
            try:
                self.tell(ticket.n, f"Your plan {ticket.plan} " + told.format(plan=ticket.plan))
            except Refused:
                pass
        return ticket

    def _plan_status(self, ticket) -> str:
        return self.record.remembered(("plan status", ticket.n, ticket.updated), lambda: self._plan_status_now(ticket))

    def _plan_status_now(self, ticket) -> str:
        from features.plans.progress import first_open_phase
        if not ticket.plan:
            return ""
        plan = self._plan_of(ticket)
        if plan is None:
            return ""
        if plan.status == PLAN_DONE and first_open_phase(self.record.sibling(ticket.work_environment), plan):
            return ACTIVE
        return plan.status

    def _plan_waits(self, ticket) -> bool:
        return self._plan_status(ticket) in (READY, WAITING)

    def _idle_by_design(self, ticket) -> bool:
        """A ticket that waits on open tickets, on its plan's approval, on its approved plan's turn or on its merge has an agent with nothing to do on purpose."""
        return bool(self._waiting_on(ticket)) or ticket.approved_early or self._plan_status(ticket) in (READY, WAITING, PLAN_DONE) or self._rows_done(ticket)

    def _rows_done(self, ticket) -> bool:
        """Whether every row of the ticket's plan is closed, though the plan has not yet been marked done: its agent has finished and waits on the merge."""
        from features.plans.progress import first_open_phase
        plan = self._plan_of(ticket)
        return plan is not None and plan.status == ACTIVE and bool(plan.phases) and not first_open_phase(self.record.sibling(ticket.work_environment), plan)

    def _needing_a_look(self, boards: list[int]) -> list[tuple]:
        sessions, running = Sessions(self.record.root).all(), len(self._running())
        started = [ticket for ticket in self.rows.standing() if ticket.work_environment and not ticket.halted and (ticket.agent_seen or ticket.launched)
                   and time.time() - ticket.launched > LAUNCHING_FOR and ticket.board and int(ticket.board) in boards]
        looked = [(ticket, self._runtime(ticket, sessions, running)) for ticket in started]
        return [(ticket, state) for ticket, state in looked if state.kind in NEEDS_A_LOOK and not self._idle_by_design(ticket)] + \
               [(ticket, CardState("you", reason)) for ticket, _ in looked if (reason := self._off_branch(ticket))]

    def _revive(self, ticket) -> bool:
        if ticket.restarts >= MOST_RESTARTS or ticket.queued:
            return False
        self.update(ticket.n, restarts=ticket.restarts + 1)
        return not self.start(ticket.n).queued

    @action
    def bind(self, n: int):
        ticket = self.load(n)
        if ticket.work_environment:
            return ticket
        name = f"{self.type}-{ticket.n}"
        environments = Environments(self.record, actor=self.actor)
        held = environments.rows.by_title(name)
        if held is None:
            environments.create(name, abstract=f"Where {self.type} {ticket.n} runs", owner=ticket.ref, launched_from=self.record.env, kind=EnvironmentKind.TICKET)
        elif not held.owner:
            environments.update(held.n, owner=ticket.ref, launched_from=self.record.env, kind=EnvironmentKind.TICKET)
        place = Record(self.record.root, name)
        prompted(place)
        for feature in QUIET_IN_TICKETS:
            Features(place, actor=SYSTEM).switch(feature, False)
        return self.update(ticket.n, work_environment=name)

    def _bind_to(self, n: int, name: str):
        ticket = self.update(int(n), work_environment=name)
        return self._based(ticket, self._started_at(ticket))

    def _plan_owner(self, name: str) -> int:
        return self._owned_by(name, "plan")

    def _owned_by(self, name: str, kind: str) -> int:
        place = Environments(self.record, actor=SYSTEM).rows.by_title(name) if name else None
        return place.owned_by(kind) if place else 0

    def _in_plan_worktree(self, ticket) -> bool:
        return bool(self._plan_owner(ticket.work_environment))

    def _plans_here(self) -> Plans:
        return Plans(self.record, actor=SYSTEM)

    def _close_plan_worktree(self, place: str) -> None:
        if any(r.work_environment == place for r in self.rows.standing()):
            return
        for env in Environments(self.record, actor=SYSTEM).rows.every():
            session = Sessions(self.record.root).holder(env.title) if env.title == place or env.launched_from == place else ""
            if session:
                self._ask_to_stop(session)
        self._plans_here().update(self._plan_owner(place), merged=time.time())

    def _hand_to_plan(self, ticket):
        try:
            self.tell(ticket.n, HANDED.format(ref=ticket.ref, title=ticket.title, brief=ticket.brief, n=ticket.n))
        except Refused:
            return self.update(ticket.n, queued=True, queued_at=ticket.queued_at or time.time())
        return self.update(ticket.n, queued=False, queued_at=0.0)

    @action
    def agent_session(self, n: int) -> str:
        ticket = self.peek(n)
        if not ticket.work_environment:
            return ""
        sessions = Sessions(self.record.root)
        if self.record.memo is None:
            return sessions.holder(ticket.work_environment)
        holding = self.record.remembered(("environment holders", sessions.version()), sessions.holding)
        return holding.get(ticket.work_environment, "")

    @action
    def complete(self, n: int, how: str = "", yes: bool = False, **data):
        ticket = self.load(n)
        landed = bool(ticket.work_environment) and self._merged(ticket)
        if ticket.work_environment and not yes and not landed:
            raise Refused(f"{self.type} {ticket.n}'s branch {self._branch(ticket)} is not merged: merge its pull request first, or --yes closes it anyway")
        return self._finished(ticket, how, landed, **data)

    def _finished(self, ticket, how: str, landed: bool, **data):
        closed = super().complete(ticket.n, how, **data)
        for rows, proposal in self._proposals(closed):
            if landed:
                rows.reopen(proposal.n, f"{self.type} {closed.n}'s branch was merged")
            else:
                rows.delete(proposal.n, f"{self.type} {closed.n} closed without its branch merged")
        self._stop(closed)
        environments = Environments(self.record, actor=self.actor)
        place = environments.rows.by_title(closed.work_environment) if closed.work_environment else None
        if place:
            try:
                environments.complete(place.n, how=f"{self.type} {closed.n} closed", yes=True)
            except Refused:
                pass
        self._apply_early_approvals()
        return closed

    @action
    def reopen(self, n: int, why: str):
        """Brings a closed ticket back with its environment, and with it its plan and agent conversation, in the board's start stage; a branch that was merged starts again from where it landed, so the sweep does not close the ticket the minute it is open; journal ticket start then carries it on."""
        ticket = super().reopen(n, why)
        if not ticket.work_environment:
            return ticket
        environments = Environments(self.record, actor=SYSTEM)
        if not environments.rows.by_title(ticket.work_environment):
            environments.restored(ticket.work_environment, owner=ticket.ref, launched_from=self.record.env, kind=EnvironmentKind.TICKET)
        if ticket.plan and self._plan_of(ticket) is None:
            ticket = self.update(ticket.n, plan=0)
        if self._merged(ticket):
            ticket = self._based(ticket, self._landed_at(ticket))
        board = self._board(ticket)
        began = board.stage_for(START) if board else ""
        if began and ticket.stage == board.stage_for(DONE):
            ticket = self.update(ticket.n, stage=began)
        self.comment(ticket.n, f"Reopened: {why}. journal {self.type} start {ticket.n} carries it on in its earlier conversation.")
        return self.load(ticket.n)

    def raise_moment(self, n: int, moment: str, **data) -> None:
        self.record.emit(self.type, n, moment, SYSTEM, scope=self.resource.scope, **data)

    def hold(self, type_: str, n: int) -> None:
        owner = Environments(self.record, actor=self.actor).rows.by_title(self.record.env)
        if owner and owner.owned_by(self.type):
            CONTROLLERS[type_](self.record, actor=self.actor).complete(n, how=f"proposed for {owner.owner.replace(':', ' ')}; it counts once that branch is merged",
                                                                      proposed_for=owner.owner)

    def _proposals(self, ticket) -> list:
        return [(rows, rows.load(row["n"])) for rows in (CONTROLLERS[t](self.record, actor=self.actor) for t in HELD)
                for row in rows.rows.by("proposed_for", ticket.ref) if not row["deleted"]]

    def _stop_orphaned(self) -> list[str]:
        kept = {row.ref for row in self.rows.every() if not row.deleted}
        owned = [env.title for env in Environments(self.record, actor=SYSTEM).rows.every()
                 if not env.deleted and env.owned_by(self.type) and env.owner not in kept]
        stopped = [place for place in owned if Sessions(self.record.root).holder(place)]
        for place in stopped:
            self._ask_to_stop(Sessions(self.record.root).holder(place))
        return stopped

    def close_merged(self) -> list:
        return self._closed([r for r in self.rows.standing() if r.work_environment and self._ran(r) and self._settled(r) and self._merged(r)])

    def _settled(self, ticket) -> bool:
        """Whether its agent has ended its turn and nothing waits for it, so stopping it cuts nothing short: not a turn under way, no message it has not read, and no note typed to it a moment ago."""
        there = Record(self.record.root, ticket.work_environment)
        return not self._working(ticket) and not Messages(there, actor=AGENT).unread() and time.time() - ticket.told > TELL_GRACE

    def _working(self, ticket) -> bool:
        return Agents(self.record.sibling(ticket.work_environment), actor=SYSTEM).state(ticket.work_environment) == WORKING_STATE

    def _closed(self, merged: list, landed: bool = False) -> list:
        for ticket in merged:
            board = self._board(ticket)
            finished = board.stage_for(DONE) if board else ""
            how = f"its branch {self._branch(ticket)} was merged"
            try:
                self._finished(ticket, how, True) if landed else self.complete(ticket.n, how=how)
            except Refused:
                continue
            if finished:
                self.update(ticket.n, stage=finished)
        for place in {ticket.work_environment for ticket in merged if self._in_plan_worktree(ticket)}:
            self._close_plan_worktree(place)
        return merged

    def _ran(self, ticket) -> bool:
        return not ticket.queued and not self._waiting_on(ticket) and bool(ticket.agent_seen or ticket.launched or self._in_plan_worktree(ticket))

    @action
    def merge(self, n: int):
        ticket = self.load(n)
        if not ticket.work_environment:
            self._refuse(f"{self.type} {ticket.n} was never started, so it has no branch to merge")
        branch = self._branch(ticket)
        for name, place, base in self._repositories(ticket):
            if name != "." and not changed(place, branch, base):
                continue
            into = self._into_at(ticket, name, place) if self._into(ticket) != "HEAD" else current_branch(place)
            failed = merged_into(place, branch, into)
            if failed:
                where = "" if name == "." else f" in {name}"
                self._refuse(f"{self.type} {ticket.n}'s branch {branch}{where} was not merged into {into}: {failed}")
        ticket = self.load(ticket.n)
        self._closed([ticket], landed=True)
        closed = self.load(ticket.n)
        if not closed.completed:
            self._refuse(f"{self.type} {ticket.n}'s branch {branch} was merged, but the ticket could not be closed: journal {self.type} complete {ticket.n} --yes closes it")
        self._released(closed)
        return closed

    def _released(self, ticket) -> None:
        board = self._board(ticket)
        if not board or not board.after_merge.strip():
            return
        code, output = streamed(["/bin/sh", "-c", board.after_merge], self.record.root.parent, RELEASE_TIMEOUT, lambda _: None)
        self.comment(ticket.n, f"After the merge, {board.after_merge} {'ran' if code == 0 else 'failed'}:\n{tail(output)}")

    @action
    def stop(self, n: int):
        ticket = self.load(n)
        self._stop(ticket)
        self._gone(ticket)
        return self.update(ticket.n, halted=True, launched=0.0)

    def _alive_agents(self, ticket) -> list[str]:
        """The sessions of the ticket's worktree whose process still runs, also one that has let go of the worktree while it shuts down."""
        place = ticket.work_environment
        return [name for name, held in Sessions(self.record.root).all().items() if place and held.environment == place and live(held)]

    def _gone(self, ticket) -> None:
        """Waits until the agent's process has left, as long as an agent takes to, so a start that follows never finds two agents in one worktree."""
        if self._in_plan_worktree(ticket):
            return
        until = time.monotonic() + STOP_WAIT
        while self._alive_agents(ticket) and time.monotonic() < until:
            time.sleep(STOP_POLL)

    def _stop(self, ticket) -> None:
        session = self.agent_session(ticket.n)
        if session and not self._in_plan_worktree(ticket):
            self._ask_to_stop(session)

    @action
    def comments(self, n: int) -> list[Resource]:
        ticket = self.load(n)
        here = super().comments(n)
        if not ticket.work_environment or ticket.work_environment == self.record.env:
            return here
        there = Comments(self.record.sibling(ticket.work_environment), actor=self.actor).linked_to(ticket.ref)
        return sorted([*here, *there], key=lambda comment: comment.created)

    @action
    def move(self, n: int, stage: str, model: str | None = None):
        ticket = self.load(n)
        board = self._board(ticket)
        starting = bool(board) and board.meanings.get(stage.strip()) == START
        if starting:
            self._confirmed(ticket)
            self._modelled(ticket, model, f"journal ticket move {ticket.n} \"{stage.strip()}\" --model <model>")
        moved = self.update(ticket.n, stage=stage.strip())
        return self.start(moved.n, model=model) if starting else moved

    def _modelled(self, ticket, model: str | None, how: str) -> None:
        if self.actor == AGENT and model is None and not ticket.model:
            self._refuse(f"name the model {ticket.ref}'s agent runs on, as every dispatch does: {how}")

    @action
    def depend(self, n: int, on: int):
        ticket, other = self.load(n), self.load(on)
        if ticket.ref in self._reached(other) or other.n == ticket.n:
            self._refuse(f"{ticket.ref} waiting on {other.ref} would wait on itself")
        stance = PROPOSED if self.actor == AGENT else CONFIRMED
        return self.update(ticket.n, dependencies={**ticket.dependencies, other.ref: stance})

    @action
    def accept_dependencies(self, n: int, only: str = "", why: str = ""):
        return self._decide_dependencies(n, lambda ref: not only or ref.split(":")[-1] in only.split(","), "Accepted its proposed waits", why)

    @action
    def decline_dependencies(self, n: int, why: str = ""):
        return self._decide_dependencies(n, lambda ref: False, "Declined its proposed waits", why)

    def _decide_dependencies(self, n: int, kept, done: str, why: str):
        ticket = self.load(n)
        self._as_orchestrator(ticket, WAITS, f"accept or decline the proposed dependencies of {self.type} {ticket.n}", done, why)
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
        return [ref for ref in self._confirmed_refs(ticket) if self._open(ref)]

    def _open(self, ref: str) -> bool:
        try:
            other = self._at(ref)
        except Refused:
            return False
        return not other.completed and not other.deleted

    def _confirmed_refs(self, ticket) -> list:
        return [ref for ref, stance in ticket.dependencies.items() if stance == CONFIRMED]

    def _at(self, ref: str):
        return self.load(ref.split(":")[1])

    def _from_outside(self, ticket) -> bool:
        """Whether the ticket comes from an integration, such as Linear, whose words are not the journal's own."""
        import features
        from features.groups import Group
        made = features.FEATURES.get(ticket.source)
        return bool(made) and made.group == Group.INTEGRATIONS

    def _only_you(self, ticket, doing: str, once_asked: bool = False) -> None:
        """A ticket from an integration is started and confirmed only by you; an agent and auto mode are refused, and the queue carries on only what you already started."""
        if not self._from_outside(ticket) or self.actor == USER or (once_asked and self.actor == SYSTEM and ticket.data.get("user_started")):
            return
        self._refuse(f"only you {doing} a ticket from {ticket.source}, in the viewer: its words come from outside, so an agent or auto mode never does")

    @action
    def confirm(self, n: int, why: str = ""):
        ticket = self.load(n)
        self._only_you(ticket, "confirm")
        self._as_orchestrator(ticket, DRAFTS, f"confirm the draft of {self.type} {ticket.n}", "Confirmed the draft", why)
        return self.update(ticket.n, draft=False)

    @action
    def start(self, n: int, provider: str | None = None, model: str | None = None):
        self._only_you(self.load(n), "start", once_asked=True)
        self._confirmed(self.load(n))
        self.mark_seen()
        ticket = self.bind(int(n))
        if ticket.board and self._board(ticket).finished:
            Boards(self.record, actor=SYSTEM).unfinish(int(ticket.board))
        into = self._into(self.load(n))
        if into != "HEAD" and any(name == "." and not present(place, into) for name, place, _ in self._repositories(self.load(n))):
            self._refuse(f"its board works on the branch {into}, which does not exist; make it, or change the board's branch")
        self._modelled(ticket, model, f"journal ticket start {ticket.n} --model <model>")
        you_started = bool(ticket.data.get("user_started")) or (self.actor == USER and self._from_outside(ticket))
        ticket = self.update(ticket.n, provider=provider or ticket.provider, model=model or ticket.model, halted=False, user_started=you_started)
        with State(self.record.root / "runtime" / "ticket-starts.json").changing():
            ticket = self.load(ticket.n)
            if self._in_plan_worktree(ticket):
                return self._hand_to_plan(ticket)
            if self._live(ticket):
                return ticket
            if 0 < self._limit() <= len({r.work_environment for r in self._running()}):
                return self.update(ticket.n, queued=True, queued_at=ticket.queued_at or time.time())
            ticket = self.update(ticket.n, queued=False, queued_at=0.0, launched=time.time())
            ticket = self._doing(ticket)
        bus.background(f"launch {self.record.root} {ticket.n}", lambda: self._launched(ticket.n))
        return self.load(ticket.n)

    def _doing(self, ticket):
        """A ticket that is started stands in its board's start stage, unless it is already past it."""
        board = self._board(ticket)
        began = board.stage_for(START) if board else ""
        if began and ticket.stage != began and self._meaning(ticket) not in (START, REVIEW, DONE):
            return self.update(ticket.n, stage=began)
        return ticket

    def _launched(self, n: int) -> None:
        """Cuts the branch in each repository and starts the agent: the slow part of a start, made behind its answer; when it cannot, the ticket is left without a launch under way and says why."""
        ticket = self.load(n)
        try:
            self._launch(ticket, self._into(ticket))
        except (Refused, SystemExit) as why:
            self.update(ticket.n, launched=0.0)
            self.comment(ticket.n, f"it did not start: {why}")
            raise

    def _launch(self, ticket, into: str) -> None:
        from agents.terminal import detached, launch_output, prompted
        from providers import DRIVERS, PROVIDERS
        driver, place = DRIVERS[ticket.provider], ticket.work_environment
        earlier = Sessions(self.record.root).last(place, ticket.provider) or driver.printed_session(launch_output(self.record.root, place))
        if earlier and not PROVIDERS[ticket.provider]().conversation_file(earlier):
            earlier = ""
        args = driver.within(["--model", ticket.model] if ticket.model else [], place)
        project = self.record.root.parent
        if ticket.base and not ticket.agent_seen:
            self._discard_failed_start(ticket)
            ticket = self.update(ticket.n, base="", bases={})
        fresh = not ticket.base
        ticket = self._based(ticket, self._started_at(ticket))
        for _, repo, _ in self._repositories(ticket):
            keep_own_packages(repo, ticket.work_environment, bool(ticket.own_packages))
        for _, repo, base in self._repositories(ticket) if into != "HEAD" else ():
            stuck = branched(repo, self._branch(ticket), base, fresh)
            if stuck:
                self._refuse(stuck)
        if fresh and into != "HEAD":
            ticket = self._based(ticket, {name: tip(repo, f"refs/heads/{self._branch(ticket)}") for name, repo, _ in self._repositories(ticket)})
        detached(self.record.root, project, place, ticket.provider,
                 prompted(self.record.root, place, driver.resumed(args, earlier), f"{CARRY_ON.format(ref=ticket.ref)} {self._kickoff(ticket)}") if earlier
                 else prompted(self.record.root, place, args, self._kickoff(ticket)))

    def _kickoff(self, ticket) -> str:
        into = self._into(ticket)
        return (f"You work {ticket.ref}, {ticket.title}, in this environment and its worktree. {ticket.brief}\n"
                + (f"Continue its plan {ticket.plan}: journal plan progress {ticket.plan} says where it stands. " if self._plan_of(ticket) else
                   f"Draft a plan for it with journal plan create and link it with journal ticket update {ticket.n} --set plan=<n>. ")
                + f"When it is complete, mark it ready with journal plan ready; it starts once it is approved, by the user or by the agent "
                f"orchestrating the board, and you are told when. Hand domain work out with journal todo delegate. "
                f"Commit your work on your own branch without releasing it, with no version bump and no tag: the release "
                f"happens when it is merged. Say when it is done: whoever runs the board merges it into "
                f"{into if into != 'HEAD' else 'the project branch'} with journal ticket merge. "
                f"Never merge it yourself, into that branch or any other."
                + (f" Its owner is the {ticket.owner} domain: hand its work to that domain's lead first." if ticket.owner else "")
                + self._wait_note(ticket, into)
                + (f" The user declined its proposed wait on {', '.join(ticket.declined)}: do not wait for them." if ticket.declined else "")
                + "".join(f" It came from {ref}: read that request and the questions answered on it before you plan."
                          for ref in ticket.refs if ref.startswith("message:")))

    def _wait_note(self, ticket, into: str) -> str:
        waits = self._waiting_on(ticket)
        if not waits:
            return ""
        return (f" It waits on {', '.join(waits)}: write its plan now, but its plan is approved and its work begins once they are merged; "
                f"then bring {into if into != 'HEAD' else 'the project branch'} into your branch before you change code.")

    def start_queued(self) -> None:
        for n in self._queue():
            try:
                if self.start(n).queued:
                    return
            except Refused:
                continue

    def _queue(self) -> list:
        """The queued tickets in the order they start: those other tickets wait on first, then by when they queued."""
        return [r.n for r in sorted((r for r in self.rows.standing() if r.queued), key=lambda r: (-self._depended_on(r), r.queued_at))]

    def _depended_on(self, ticket) -> int:
        return sum(1 for other in self.rows.standing() if ticket.ref in self._confirmed_refs(other))

    @action
    def queue_before(self, n: int, other: int):
        ticket, target = self.load(n), self.load(other)
        queue = [queued for queued in self._queue() if queued != ticket.n]
        if not ticket.queued or target.n not in queue:
            self._refuse(f"only a queued {self.type} moves before another queued one")
        at = queue.index(target.n)
        before = self.load(queue[at - 1]).queued_at if at else target.queued_at - 1
        return self.update(ticket.n, queued_at=(before + target.queued_at) / 2)

    @action
    def place(self, n: int, before: int):
        ticket, target = self.load(n), self.load(before)
        if ticket.queued and target.queued:
            return self.queue_before(ticket.n, target.n)
        column = sorted((r for r in self.rows.standing() if r.n != ticket.n and int(r.board) == int(target.board) and r.stage == target.stage), key=lambda r: r.position)
        return self.update(ticket.n, rank=rank_before(column, target.n))

    @action
    def start_next(self, n: int):
        ticket = self.load(n)
        self._only_you(ticket, "start", once_asked=True)
        if not ticket.queued:
            self._refuse(f"{self.type} {ticket.n} is not queued")
        first = min((self.load(m).queued_at for m in self._queue()), default=time.time())
        return self.update(ticket.n, queued_at=first - 1)

    def _running(self) -> list:
        """The tickets holding a running slot: an agent that works, not one that was stopped, nor one whose ticket waits on another, which holds none."""
        return self.record.remembered("running tickets", lambda: [r for r in self.rows.standing() if r.work_environment and not r.halted and self._live(r) and not self._waiting_on(r)])

    def _live(self, ticket) -> bool:
        return bool(self.agent_session(ticket.n)) or bool(self._alive_agents(ticket)) or time.time() - ticket.launched < LAUNCHING_FOR

    def mark_seen(self) -> None:
        for ticket in self.rows.standing():
            if ticket.work_environment and (ticket.launched or not ticket.agent_seen) and self.agent_session(ticket.n):
                self.update(ticket.n, launched=0.0, agent_seen=time.time())

    def _confirmed(self, ticket) -> None:
        if ticket.draft:
            by = "the user in the viewer" if self._from_outside(ticket) else f"its board's orchestrator (journal {self.type} confirm {ticket.n} --why \"<reason>\") or the user in the viewer"
            self._refuse(f"{self.type} {ticket.n} is a draft and does not start until it is confirmed, by {by}")

    def _field_choices(self, r: Resource) -> dict:
        from engine.organization import organization
        boards = [{"key": str(board.n), "label": board.title, "first_stage": (board.stages or [""])[0]}
                  for board in Boards(self.record, actor=SYSTEM).rows.standing()]
        try:
            domains = [{"key": domain.name, "label": domain.title or domain.name} for domain in organization(self.record.root.parent).domains]
        except Refused:
            domains = []
        return {"board": boards, "stage": [{"key": stage, "label": stage} for stage in self._stages(r.board)], "owner": domains}

    def _board(self, ticket):
        return Boards(self.record, actor=SYSTEM).load(ticket.board) if ticket.board else None

    def _stages(self, board) -> list:
        return Boards(self.record, actor=self.actor).load(board).stages if board else []

    def _from_source(self, source: str, source_id: str | None):
        if not source_id:
            return None
        return next((r for r in self.rows.standing() if r.source == source and r.source_id == source_id), None)


resources_module.register(Ticket)
types_module.register(Tickets)
