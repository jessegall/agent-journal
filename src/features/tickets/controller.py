import re
import time
from pathlib import Path
from dataclasses import asdict, dataclass

import controllers.types as types_module
from controllers.types import Environments, Features
from engine.record import Record
from engine.actors import IDLE
from engine.seats import terminal_of
from engine.state import State
from engine.stop import ask_session
from engine.worktree import branched, changed, contains, current_branch, git, keep, linked, merged, merged_into, present, roots, spread, tip
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
from controllers.types import Agents, Messages, Questions, Todos, Works
from features.plans.controller import READY, WAITING, Plans
from resources.base import AGENT, ESCALATED, Refused, Resource, SYSTEM
from resources.shapes import LEVELS, priority_level, rank_before


PROPOSED, CONFIRMED = "proposed", "confirmed"
LAUNCHING_FOR = 60.0
SILENT_AFTER = 300.0
RETURNS_BEFORE_ESCALATING = 2
CARD_EXTRAS: list = []
REPOSITORY_STATES: dict = {}
PEOPLE: dict = {}
WAITS_ON_PEOPLE = re.compile(r"\b(?:orchestrator|user|you|your|approv\w*|decision|decide\w*|answer\w*|review\w*)\b", re.IGNORECASE)
LOOK_AGAIN_AFTER = 30
STATES_KEPT = 500
HELD = ("rule", "doc", "tool")
QUIET_IN_TICKETS = ("dev_faults",)
CARRY_ON = "Carry on with {ref} where you left off."
HANDED = ("{ref}, {title}, is yours to do in this worktree, after the tickets you already have: {brief} Read it with journal "
          "ticket show {n}, commit it on this branch, and say when it is done.")
MOST_RESTARTS = 1
REVIEWED_BY_SUBAGENT = "subagent"
PLANS, WAITS, DRAFTS = "orchestrator_approves_plans", "orchestrator_accepts_waits", "orchestrator_confirms_drafts"
SCREEN_LINES, SCREEN_BYTES = 40, 32768
NEEDS_A_LOOK = ("you", "stopped")


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


RUNNING_KINDS = ("shell_rows", "subagent_rows", "monitor_rows")
RUN_TEXT = 60


def running_behind(row) -> list[dict]:
    return [entry for kind in RUNNING_KINDS for entry in (row.data.get(kind) or []) if entry.get("running")]


def busy_behind(row) -> bool:
    return bool(running_behind(row))


class Tickets(Controller):
    resource = Ticket

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        source = data.pop("source", None) or self.actor
        known = self._from_source(source, data.get("source_id"))
        if known:
            return self.update(known.n, title=title, abstract=abstract or None, brief=brief or None)
        if data.get("draft") and self.actor == AGENT and Boards(self.record, actor=self.actor).cancelled_lately(data["board"]):
            self._refuse(f"the request on board {data['board']} was cancelled, so stop drafting")
        after = [word.strip() for word in str(data.pop("after", "") or "").split(",") if word.strip()]
        opening = self._stages(data.get("board"))[:1]
        made = super().create(title, abstract, brief, source=source, **{**dict(zip(["stage"], opening)), **data})
        for other in after:
            made = self.depend(made.n, int(other))
        return made

    @internal
    def save(self, r: Resource, action: str, **event) -> Resource:
        if r.board and r.stage not in self._stages(r.board):
            raise Refused(f"board {r.board} has no stage {r.stage!r}")
        return super().save(r, action, **event)

    def board(self, n: int) -> dict:
        stages = self._stages(n)
        tickets = sorted((r for r in self._standing(closed_since=1) if int(r.board) == int(n) and not r.draft), key=lambda r: r.position)
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
        working = self._role_work()
        return [{"name": f"{domain.name}/{role.name}", "title": role.title or role.name, "domain": domain.name, "domain_title": domain.title or domain.name,
                 "tickets": working.get((domain.name, role.name), [])} for domain in found.domains for role in domain.roles]

    def _role_work(self) -> dict:
        working: dict = {}
        for place, ticket in {ticket.work_environment: ticket for ticket in self._running()}.items():
            plan = self._plan_owner(place)
            shown = {"plan": plan, "title": self._plans_here().load(plan).title} if plan else {"plan": 0, "title": ticket.title}
            todos = Todos(Record(self.record.root, place), actor=SYSTEM)
            for row in todos.summaries():
                if row["completed"] or row["deleted"]:
                    continue
                todo = todos.load(row["n"])
                if todo.data.get("role") and todo.data.get("status") == "started":
                    working.setdefault((todo.data["domain"], todo.data["role"]), []).append(
                        {"n": ticket.n, **shown, "env": todo.data.get("role_environment", ""), "worktree": place})
        return working

    def _slots(self, running: list, sessions: dict) -> Slots:
        kinds = [self._runtime(ticket, sessions, len(running)).kind for ticket in self._standing()]
        return Slots([{"n": ticket.n, "title": ticket.title, "board": int(ticket.board)} for ticket in running],
                     self._limit(), kinds.count("queued"), kinds.count("you"))

    def _limit(self) -> int:
        return max(0, int(TicketsDetails.values(self.record).running))

    def _card(self, ticket, stage: str, stages: list, sessions: dict, running: int) -> Card:
        extras = [extra(self.record, ticket) for extra in CARD_EXTRAS]
        state = self._runtime(ticket, sessions, running)
        return Card(ticket.n, ticket.title, int(ticket.priority or LEVELS["default"]), stage, reason=state.text, state=state.kind, session=state.session, assigned=ticket.owner, targets=[s for s in stages if s != stage],
                    updated=ticket.updated, completed=ticket.completed, type=self.type,
                    actions=[*self._actions(ticket, state.session), *(action for more in extras for action in more.actions)],
                    link=next((more.link for more in extras if more.link), ""),
                    link_label=next((more.link_label for more in extras if more.link_label), ""),
                    repositories=self._repository_states(ticket))

    def _repository_states(self, ticket) -> list:
        if not ticket.work_environment or ticket.completed or not spread(self.record.root.parent):
            return []
        key = (str(self.record.root), ticket.n, ticket.updated, int(time.time() // LOOK_AGAIN_AFTER))
        if key not in REPOSITORY_STATES:
            if len(REPOSITORY_STATES) > STATES_KEPT:
                REPOSITORY_STATES.clear()
            branch, into = self._branch(ticket), self._into(ticket)
            REPOSITORY_STATES[key] = [{"name": name, "branch": branch, "state": "merged" if merged(place, branch, base, into) else
                                       "changed" if changed(place, branch, base) else "untouched"} for name, place, base in self._repositories(ticket)]
        return REPOSITORY_STATES[key]

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
        from providers import DRIVERS
        driver = DRIVERS[ticket.agent](Record(self.record.root, ticket.work_environment), terminal_of(self.record.root, session))
        if not driver.enter(note.strip()):
            self._refuse(f"the note to {self.type} {ticket.n}'s agent stayed in its input box; its agent may be stuck")
        return self.update(ticket.n, told=time.time())

    def screen(self, n: int, lines: int = SCREEN_LINES) -> str:
        from providers import DRIVERS
        ticket = self.load(int(n))
        session = self.agent_session(ticket.n)
        if not session:
            self._refuse(f"{self.type} {ticket.n} has no agent running to look at")
        driver = DRIVERS[ticket.agent](Record(self.record.root, ticket.work_environment), terminal_of(self.record.root, session))
        shown = [line.rstrip() for line in driver.last_printed(SCREEN_BYTES).replace("\r", "\n").splitlines() if line.strip()]
        return "\n".join(shown[-int(lines):])

    def send_back(self, n: int, note: str):
        ticket = self.tell(n, note)
        started = [stage for stage, meaning in Boards(self.record, actor=self.actor).load(int(ticket.board)).meanings.items() if meaning == START]
        ticket = self.update(ticket.n, sent_back=int(ticket.sent_back) + 1, **({"stage": started[0]} if started else {}))
        if ticket.sent_back >= RETURNS_BEFORE_ESCALATING:
            self.record.emit(self.type, ticket.n, ESCALATED, self.actor)
        return ticket

    def _plan_waits(self, ticket) -> bool:
        return self._plan_status(ticket) == READY

    def _plans(self, ticket) -> Plans:
        return Plans(Record(self.record.root, ticket.work_environment), actor=self.actor)

    def approve_plan(self, n: int):
        return self._decide_plan(n, READY, "approve", Plans.approve, "")

    def continue_plan(self, n: int):
        return self._decide_plan(n, WAITING, "continue", Plans.resume, "is past its checkpoint: carry on with its next phase.")

    def _decide_plan(self, n: int, status: str, word: str, act, told: str):
        ticket = self.load(int(n))
        if self._plan_status(ticket) != status:
            self._refuse(f"{self.type} {ticket.n} has no plan waiting for you to {word}")
        if self.actor != AGENT:
            act(self._plans(ticket), int(ticket.plan))
            return ticket
        if not self._orchestrator_may(ticket, PLANS) or int(ticket.board) not in self._orchestrating():
            self._refuse(f"only the user may {word} the plan of {self.type} {ticket.n}, or the agent orchestrating its board while its "
                         f"auto mode is on and the board has {PLANS} set; never the agent that wrote it")
        act(Plans(Record(self.record.root, ticket.work_environment), actor=SYSTEM), int(ticket.plan))
        if told and self.agent_session(ticket.n):
            try:
                self.tell(ticket.n, f"Your plan {ticket.plan} " + told.format(plan=ticket.plan))
            except Refused:
                pass
        return ticket

    def _plan_status(self, ticket) -> str:
        return self._plans(ticket).load(int(ticket.plan)).status if ticket.plan else ""

    def _needing_a_look(self, boards: list[int]) -> list[tuple]:
        sessions, running = Sessions(self.record.root).all(), len(self._running())
        started = [ticket for ticket in self._standing() if ticket.work_environment and not ticket.halted and (ticket.agent_seen or ticket.launched)
                   and time.time() - ticket.launched > LAUNCHING_FOR and ticket.board and int(ticket.board) in boards]
        looked = [(ticket, self._runtime(ticket, sessions, running)) for ticket in started]
        return [(ticket, state) for ticket, state in looked if state.kind in NEEDS_A_LOOK] + \
               [(ticket, CardState("you", reason)) for ticket, _ in looked if (reason := self._off_branch(ticket))]

    def _off_branch(self, ticket) -> str:
        into = self._into(ticket)
        off = [(name, base) for name, place, base in self._repositories(ticket) if into != "HEAD" and base and not contains(place, base, into)]
        if not off:
            return ""
        name, base = off[0]
        where = "" if name == "." else f" in {name}"
        return (f"its branch {self._branch(ticket)}{where} started at {base[:9]}, which is not on {into}; tell its agent to rebase "
                f"onto {into} (git rebase --onto {into} {base[:9]}) before it is merged")

    def _repositories(self, ticket) -> list[tuple[str, Path, str]]:
        return [(name, place, ticket.base if name == "." else ticket.bases.get(name, "")) for name, place in roots(self.record.root.parent).items()]

    def _started_at(self, ticket, into: str) -> dict:
        branch = self._branch(ticket)
        return {name: tip(place, into) if not base or not present(place, f"refs/heads/{branch}") else base
                for name, place, base in self._repositories(ticket)}

    def _based(self, ticket, bases: dict):
        return self.update(ticket.n, base=bases.get(".", ""), bases={name: base for name, base in bases.items() if name != "."})

    def _revive(self, ticket) -> bool:
        if ticket.restarts >= MOST_RESTARTS or ticket.queued:
            return False
        self.update(ticket.n, restarts=ticket.restarts + 1)
        return not self.start(ticket.n).queued

    def _orchestrating(self) -> list[int]:
        from features.sequences.controller import Sequences
        from features.sequences.orchestration import ORCHESTRATION
        sequence = Sequences(self.record, actor=SYSTEM)._titled(ORCHESTRATION["title"])
        keys = sequence.runs if sequence else {}
        return [int(key.rsplit(":", 1)[1]) for key in keys if key.startswith(f"{self.record.env}|board:")]

    def _awaiting_orchestrator(self) -> list:
        boards = self._orchestrating()
        return [ticket for ticket in self._standing() if ticket.work_environment and ticket.board and int(ticket.board) in boards
                and self._orchestrator_may(ticket, PLANS) and self._plan_status(ticket) in (READY, WAITING)]

    def _review(self, ticket) -> str:
        read = f"journal --env {ticket.work_environment} plan read {ticket.plan}"
        if Boards(self.record, actor=SYSTEM).load(int(ticket.board)).plan_reviewer == REVIEWED_BY_SUBAGENT:
            return f"Dispatch a reviewer subagent to check it against the ticket's card; it reads it with {read}."
        return f"Review it yourself against the ticket's card: {read}."

    def _orchestrator_may(self, ticket, permission: str) -> bool:
        from features.work_tracking.auto import automatic
        return bool(ticket.board) and bool(getattr(Boards(self.record, actor=SYSTEM).load(int(ticket.board)), permission)) and automatic(self.record)

    def _awaiting_decisions(self) -> list:
        boards = self._orchestrating()
        on_board = [ticket for ticket in self._standing() if ticket.board and int(ticket.board) in boards]
        return [(ticket, WAITS) for ticket in on_board if PROPOSED in ticket.dependencies.values() and self._orchestrator_may(ticket, WAITS)] + \
               [(ticket, DRAFTS) for ticket in on_board if ticket.draft and self._orchestrator_may(ticket, DRAFTS)]

    def _runtime(self, ticket, sessions: dict, running: int) -> CardState:
        if ticket.completed:
            return CardState("done", ticket.outcome or "done")
        place = ticket.work_environment
        proposed = [ref for ref, stance in ticket.dependencies.items() if stance == PROPOSED]
        if proposed:
            return CardState("you", f"the agent proposes it waits on {', '.join(ref.replace(':', ' ') for ref in proposed)}")
        if not place:
            return CardState("draft", "a draft, waiting for your confirmation") if ticket.draft else CardState.plain()
        row = self._reporting(place, sessions)
        session = row.title if row else ""
        state = self._agent_state(ticket, row, running)
        if self._plan_waits(ticket):
            return CardState("you", f"{state.text} in {place}; its plan waits for your approval", session)
        return CardState(state.kind, f"{state.text} in {place}" + (f" · {state.age}" if state.age else ""), session)

    def _waited_run(self, row, place: str) -> str:
        awaited = next((w.awaiting for w in Works(Record(self.record.root, place), actor=SYSTEM)._standing() if w.awaiting), "")
        running = next((entry.get("task") or entry.get("command") or "" for entry in running_behind(row)), "")
        text = awaited or running
        return text if len(text) <= RUN_TEXT else text[:RUN_TEXT - 1].rstrip() + "…"

    def _reporting(self, place: str, sessions: dict):
        agents = Agents(Record(self.record.root, place), actor=SYSTEM)
        rows = [row for name, held in sessions.items() if held.environment == place and live(held) and (row := agents._titled(name))]
        return max(rows, key=lambda row: float(row.at or 0), default=None)

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
        if not float(row.at or 0):
            return CardState("running", "starting")
        quiet = time.time() - float(row.at)
        if row.status != IDLE and quiet > SILENT_AFTER:
            return CardState("you", f"silent for {int(quiet // 60)}m")
        if row.status == IDLE and quiet > SILENT_AFTER and not busy_behind(row):
            return CardState("you", f"idle for {int(quiet // 60)}m with nothing running in the background")
        waiting = self._waited_run(row, place) if row.status == IDLE else ""
        if waiting:
            return CardState("running", f"waiting on its run: {waiting}", age=ago(quiet))
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
            environments.create(name, abstract=f"Where {self.type} {ticket.n} runs", owner=ticket.ref, launched_from=self.record.env)
        place = Record(self.record.root, name)
        prompted(place)
        for feature in QUIET_IN_TICKETS:
            Features(place, actor=SYSTEM).switch(feature, False)
        return self.update(ticket.n, work_environment=name)

    def _bind_to(self, n: int, name: str):
        ticket = self.update(int(n), work_environment=name)
        return self._based(ticket, self._started_at(ticket, self._into(ticket)))

    def _plan_owner(self, name: str) -> int:
        return self._owned_by(name, "plan")

    def _owned_by(self, name: str, kind: str) -> int:
        place = Environments(self.record, actor=SYSTEM)._titled(name) if name else None
        owner = str(place.owner) if place else ""
        return int(owner.split(":")[1]) if owner.startswith(f"{kind}:") else 0

    def _calls(self, ticket) -> list[tuple[str, str, dict, int]]:
        place = Record(self.record.root, ticket.work_environment)
        settings = TicketsDetails.values(self.record)
        soon, late = int(settings.remind_every), int(settings.remind_own_wait_every)
        asks = [("ticket_asks", q.ref, {"question": q.n, "text": q.title, "env": ticket.work_environment}, soon) for q in Questions(place, actor=SYSTEM)._standing()]
        awaits = [("ticket_awaits", f"{w.n}|{w.awaiting}", {"text": w.awaiting}, soon if self._waits_on_people(w.awaiting) else late)
                  for w in Works(place, actor=SYSTEM)._standing() if w.awaiting]
        messages = Messages(place, actor=SYSTEM)
        written = [messages.load(row["n"]) for row in messages.summaries() if ticket.told and row["seen"][:1] == [AGENT] and row["updated"] > ticket.told and not row["deleted"]]
        replies = [("ticket_replied", message.ref, {"text": message.title}, 0) for message in written if message.created > ticket.told]
        done = [("ticket_plan_done", f"plan:{ticket.plan}", {"ahead": self._ahead(ticket)}, soon)] if self._plan_status(ticket) == "done" and self._clean(ticket) else []
        return asks + awaits + replies + done

    def _waits_on_people(self, text: str) -> bool:
        return bool(WAITS_ON_PEOPLE.search(text)) or any(name in text.lower() for name in self._people())

    def _people(self) -> list[str]:
        root = str(self.record.root)
        if root not in PEOPLE:
            named = git(self.record.root.parent, "config", "user.name").stdout.strip().lower()
            PEOPLE[root] = named.split()[:1]
        return PEOPLE[root]

    def _ahead(self, ticket) -> int:
        branch, into = self._branch(ticket), self._into(ticket)
        counts = [git(place, "rev-list", "--count", f"{into}..refs/heads/{branch}").stdout.strip() for _, place, _ in self._repositories(ticket)]
        return sum(int(count) for count in counts if count.isdigit())

    def _clean(self, ticket) -> bool:
        folders = [linked(place).get(ticket.work_environment) for _, place, _ in self._repositories(ticket)]
        return all(folder and not git(folder, "status", "--porcelain").stdout.strip() for folder in folders)

    def _in_plan_worktree(self, ticket) -> bool:
        return bool(self._plan_owner(ticket.work_environment))

    def _plans_here(self) -> Plans:
        return Plans(self.record, actor=SYSTEM)

    def _close_plan_worktree(self, place: str) -> None:
        if any(r.work_environment == place for r in self._standing()):
            return
        for env in Environments(self.record, actor=SYSTEM)._every():
            session = Sessions(self.record.root).holder(env.title) if env.title == place or env.launched_from == place else ""
            if session:
                ask_session(self.record.root, terminal_of(self.record.root, session))
        self._plans_here().update(self._plan_owner(place), merged=time.time())

    def _hand_to_plan(self, ticket):
        try:
            self.tell(ticket.n, HANDED.format(ref=ticket.ref, title=ticket.title, brief=ticket.brief, n=ticket.n))
        except Refused:
            return self.update(ticket.n, queued=True, queued_at=ticket.queued_at or time.time())
        return self.update(ticket.n, queued=False, queued_at=0.0)

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
    def _stop_orphaned(self) -> list[str]:
        kept = {row.ref for row in self._every() if not row.deleted}
        owned = [env.title for env in Environments(self.record, actor=SYSTEM)._every()
                 if not env.deleted and env.owner.startswith(f"{self.type}:") and env.owner not in kept]
        stopped = [place for place in owned if Sessions(self.record.root).holder(place)]
        for place in stopped:
            ask_session(self.record.root, terminal_of(self.record.root, Sessions(self.record.root).holder(place)))
        return stopped

    def keep_branches(self) -> None:
        for ticket in (r for r in self._standing() if r.work_environment):
            for _, place, _ in self._repositories(ticket):
                keep(place, ticket.work_environment, self._branch(ticket))

    @internal
    def close_merged(self) -> list:
        merged = [r for r in self._standing() if r.work_environment and self._merged(r)]
        for ticket in merged:
            finished = [stage for stage, meaning in (Boards(self.record, actor=self.actor).load(int(ticket.board)).meanings.items() if ticket.board else ()) if meaning == DONE]
            try:
                self.complete(ticket.n, how=f"its branch {self._branch(ticket)} was merged")
            except Refused:
                continue
            if finished:
                self.update(ticket.n, stage=finished[0])
        for place in {ticket.work_environment for ticket in merged if self._in_plan_worktree(ticket)}:
            self._close_plan_worktree(place)
        return merged

    def _branch(self, ticket) -> str:
        from providers import DRIVERS
        return DRIVERS[ticket.agent].branch(ticket.work_environment)

    def _merged(self, ticket) -> bool:
        branch, into = self._branch(ticket), self._into(ticket)
        states = [(merged(place, branch, base, into), changed(place, branch, base)) for _, place, base in self._repositories(ticket)]
        return any(done for done, _ in states) and all(done or not moved for done, moved in states)

    def merge(self, n: int):
        ticket = self.load(int(n))
        if not ticket.work_environment:
            self._refuse(f"{self.type} {ticket.n} was never started, so it has no branch to merge")
        branch = self._branch(ticket)
        for name, place, base in self._repositories(ticket):
            if name != "." and not changed(place, branch, base):
                continue
            into = self._into(ticket) if self._into(ticket) != "HEAD" else current_branch(place)
            failed = merged_into(place, branch, into)
            if failed:
                where = "" if name == "." else f" in {name}"
                self._refuse(f"{self.type} {ticket.n}'s branch {branch}{where} was not merged into {into}: {failed}")
        self.close_merged()
        return self.load(ticket.n)

    def _into(self, ticket) -> str:
        board = Boards(self.record, actor=SYSTEM).load(int(ticket.board)) if ticket.board else None
        return board.branch if board and board.branch else "HEAD"

    def stop(self, n: int):
        ticket = self.load(int(n))
        self._stop(ticket)
        return self.update(ticket.n, halted=True)

    def _stop(self, ticket) -> None:
        session = self.agent_session(ticket.n)
        if session and not self._in_plan_worktree(ticket):
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

    def accept_dependencies(self, n: int, only: str = "", why: str = ""):
        return self._decide_dependencies(n, lambda ref: not only or ref.split(":")[-1] in only.split(","), "Accepted its proposed waits", why)

    def decline_dependencies(self, n: int, why: str = ""):
        return self._decide_dependencies(n, lambda ref: False, "Declined its proposed waits", why)

    def _decide_dependencies(self, n: int, kept, done: str, why: str):
        ticket = self.load(int(n))
        self._as_orchestrator(ticket, WAITS, f"accepts or declines a {self.type}'s proposed dependencies", done, why)
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
        return self.load(int(ref.split(":")[1]))

    def confirm(self, n: int, why: str = ""):
        ticket = self.load(int(n))
        self._as_orchestrator(ticket, DRAFTS, f"confirms a drafted {self.type}, with its button or in the viewer", "Confirmed the draft", why)
        return self.update(ticket.n, draft=False)

    def _as_orchestrator(self, ticket, permission: str, gate: str, done: str, why: str) -> None:
        if self.actor != AGENT:
            return
        if not (ticket.board and int(ticket.board) in self._orchestrating() and self._orchestrator_may(ticket, permission)):
            self._refuse(f"only the user {gate}, or the agent orchestrating its board while its auto mode is on and the board has {permission} set")
        if not why.strip():
            self._refuse("say why, as the board's orchestrator: --why \"<reason>\"")
        self.comment(ticket.n, f"{done} as the board's orchestrator, under auto mode: {why.strip()}")

    def start(self, n: int, agent: str | None = None):
        from engine.terminal import detached
        from providers import DRIVERS, PROVIDERS
        self._confirmed(self.load(int(n)))
        ticket = self.bind(int(n))
        into = self._into(self.load(int(n)))
        missing = [name for name, place, _ in self._repositories(self.load(int(n))) if into != "HEAD" and not present(place, into)]
        if missing:
            where = "" if missing == ["."] else f" in {', '.join(missing)}"
            self._refuse(f"its board works on the branch {into}, which does not exist{where}; make it, or change the board's branch")
        ticket = self.update(ticket.n, agent=agent or ticket.agent, halted=False)
        with State(self.record.root / "runtime" / "ticket-starts.json").changing():
            ticket = self.load(ticket.n)
            if self._in_plan_worktree(ticket):
                return self._hand_to_plan(ticket)
            if self._live(ticket):
                return ticket
            if self._waiting_on(ticket) or 0 < self._limit() <= len({r.work_environment for r in self._running()}):
                return self.update(ticket.n, queued=True, queued_at=ticket.queued_at or time.time())
            driver, place = DRIVERS[ticket.agent], ticket.work_environment
            earlier = Sessions(self.record.root).last(place, ticket.agent)
            if earlier and not PROVIDERS[ticket.agent]().conversation_file(earlier):
                earlier = ""
            args = driver.within([*driver.AUTO_ARGS], place)
            project = self.record.root.parent
            ticket = self._based(ticket, self._started_at(ticket, into))
            for _, place, base in self._repositories(ticket) if into != "HEAD" else ():
                branched(place, self._branch(ticket), base)
            detached(self.record.root, project, place, ticket.agent,
                     driver.prompted(driver.resumed(args, earlier), CARRY_ON.format(ref=ticket.ref)) if earlier
                     else driver.prompted(args, self._kickoff(ticket)))
            return self.update(ticket.n, queued=False, queued_at=0.0, launched=time.time())

    def _kickoff(self, ticket) -> str:
        into = self._into(ticket)
        return (f"You work {ticket.ref}, {ticket.title}, in this environment and its worktree. {ticket.brief}\n"
                + (f"Continue its plan {ticket.plan}: journal plan progress {ticket.plan} says where it stands. " if ticket.plan else
                   f"Draft a plan for it with journal plan create and link it with journal ticket update {ticket.n} --set plan=<n>. ")
                + f"When it is complete, mark it ready with journal plan ready; it starts once it is approved, by the user or by the agent "
                f"orchestrating the board, and you are told when. Hand domain work out with journal todo delegate. "
                f"Commit your work on your own branch and say when it is done: whoever runs the board merges it into "
                f"{into if into != 'HEAD' else 'the project branch'} with journal ticket merge. "
                f"Never merge it yourself, into that branch or any other."
                + (f" Its owner is the {ticket.owner} domain: hand its work to that domain's lead first." if ticket.owner else "")
                + (f" The user declined its proposed wait on {', '.join(ticket.declined)}: do not wait for them." if ticket.declined else "")
                + "".join(f" It came from {ref}: read that request and the questions answered on it before you plan."
                          for ref in ticket.refs if ref.startswith("message:")))

    @internal
    def start_queued(self) -> None:
        for n in self._queue():
            try:
                if self.start(n).queued:
                    return
            except Refused:
                continue

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
            if ticket.launched or not ticket.agent_seen:
                self.update(ticket.n, launched=0.0, agent_seen=time.time())
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
