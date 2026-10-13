import time

from engine import runtime
from events.agents import ClockTicked
from engine.locks import own_sweep, project_sweep
from events.resources import ResourceCreated
from events.questions import QuestionCompleted
from framework.sending import Sent
from declaring.trigger import MINUTE, MINUTES, Trigger
from framework.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from controllers.types import Questions, Works
from resources.plans import WAITING
from controllers.types import Boards
from features.tickets.calls import PLAN_DONE_CALL, calls
from controllers.tickets.controller import HELD
from controllers.types import Tickets
from features.tickets.details import TicketsDetails
from resources.base import CHECKPOINT, FINISHED, PLAN_WAITS, STUCK, SYSTEM, Refused
from events.tickets import TicketCompleted

NUDGED = ("ticket_asks", "ticket_awaits")
PLAN_WAITS_ONCE = "plan_waits"
LONG_WAIT = "ticket_long_wait"
ATTENTION_EVERY = "ticket_attention"
LOOK_AGAIN = 15
SWEEPING, SWEEP_EVERY = "tickets-sweeping.lock", 5.0
LANDING, LAND_EVERY = "tickets-landing.lock", 60.0


def all_parked(record) -> bool:
    works = Works(record, actor=SYSTEM)
    return bool(works.rows.standing()) and not works._unparked()


class LookAfterTickets(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        with own_sweep(runtime.folder(context.record.root) / SWEEPING, SWEEP_EVERY, context.record.env) as mine:
            if mine:
                self.sweep(context, Tickets(context.record, actor=SYSTEM))

    def sweep(self, context: AgentContext, tickets: Tickets) -> None:
        tickets.mark_seen()
        with project_sweep(runtime.folder(context.record.root) / LANDING, LAND_EVERY) as landing:
            if landing:
                tickets.keep_branches()
                tickets.close_merged()
                tickets.clear_worktrees()
        tickets.start_queued()
        tickets.stop_orphaned()
        tickets.build_approved_plans()
        raise_waiting_plans(context, tickets)
        pass_on_calls(context, tickets)
        look_at_stuck(context, tickets)
        tell_the_user_of_long_waits(context, tickets)


def raise_waiting_plans(context: AgentContext, tickets: Tickets) -> None:
    paused = Boards(context.record, actor=SYSTEM).paused()
    for ticket in [t for t in tickets.awaiting_orchestrator() if not (t.board and int(t.board) in paused) and not tickets.reviewing(t)]:
        plan = tickets.plans_of(ticket).load(ticket.plan)
        if context.once(PLAN_WAITS_ONCE, f"{ticket.ref}|{ticket.plan}|{plan.updated}"):
            tickets.raise_moment(ticket.n, CHECKPOINT if plan.status == WAITING else PLAN_WAITS)


def pass_on_calls(context: AgentContext, tickets: Tickets) -> None:
    for ticket in watched(tickets):
        for kind, key, values, every in calls(tickets, ticket):
            if kind in NUDGED or not (context.every(kind, f"{ticket.ref}|{key}", Trigger(every=every, unit=MINUTES)) if every else context.once(kind, f"{ticket.ref}|{key}")):
                continue
            if kind == PLAN_DONE_CALL and not ticket.handed_in_at:
                tickets.update(ticket.n, handed_in_at=time.time())
                tickets.raise_moment(ticket.n, FINISHED)
            elif kind == PLAN_DONE_CALL:
                continue
            else:
                context.agent.nudge(kind, ticket=ticket.n, title=ticket.title, **values)


def waited(ticket) -> int:
    return int((time.time() - ticket.handed_in_at) // MINUTE)


def tell_the_user_of_long_waits(context: AgentContext, tickets: Tickets) -> None:
    limit = int(TicketsDetails.values(tickets.record).tell_the_user_after)
    for ticket in [t for t in watched(tickets) if t.handed_in_at and waited(t) >= limit]:
        if context.once(LONG_WAIT, f"{ticket.ref}|{ticket.handed_in_at}"):
            tickets.comment(ticket.n, f"Its work has waited {waited(ticket)} minutes for the orchestrator to review, test and merge it.")


def handed_in(context, agent) -> list[Sent]:
    tickets = Tickets(context.record, actor=SYSTEM)
    return [Sent(f"{ticket.ref}|{ticket.handed_in_at}", {"ticket": ticket.n, "title": ticket.title, "waited": waited(ticket)})
            for ticket in watched(tickets) if ticket.handed_in_at]


def look_at_stuck(context: AgentContext, tickets: Tickets) -> None:
    for ticket, state in tickets.needing_a_look(tickets.orchestrating()):
        if state.kind == "stopped" and tickets.revive(ticket):
            context.agent.nudge("ticket_restarted", ticket=ticket.n, title=ticket.title)
        elif context.every(ATTENTION_EVERY, f"{ticket.ref}|{state.kind}", Trigger(every=LOOK_AGAIN, unit=MINUTES)):
            tickets.raise_moment(ticket.n, STUCK, reason=state.text)


class HoldTicketKnowledge(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in HELD:
            Tickets(context.record, actor=SYSTEM).hold(event.type, event.n)


class WakeTheTicketAgent(Handler):
    def handle(self, context: Context, event: QuestionCompleted) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        n = tickets.owner_of(context.record.env, "ticket")
        if not n:
            return
        question = Questions(context.record, actor=SYSTEM).load(event.n)
        try:
            tickets.tell(n, f"Your question {question.n}, {question.title}, is answered: {question.outcome}. That is the answer of the one who runs your board: "
                            f"act on it, and never file the question again.")
        except Refused:
            return


class FinishTheBoardWithItsLastTicket(Handler):
    def handle(self, context: Context, event: TicketCompleted) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        board = tickets.board_of(tickets.load(event.n))
        if not board or not board.started or board.finished:
            return
        if any(int(other.board) == board.n for other in tickets.rows.standing()):
            return
        Boards(context.record, actor=SYSTEM).finish(board.n)


def watched(tickets: Tickets) -> list:
    boards = tickets.orchestrating()
    if not boards:
        return []
    paused = Boards(tickets.record, actor=SYSTEM).paused()
    return [t for t in tickets.rows.standing() if t.work_environment and t.board and int(t.board) in boards and int(t.board) not in paused]


def ticket_calls(kind: str):
    def about(context, agent) -> list[Sent]:
        tickets = Tickets(context.record, actor=SYSTEM)
        return [Sent(f"{ticket.ref}|{key}", {"ticket": ticket.n, "title": ticket.title, **values})
                for ticket in watched(tickets) for called, key, values, _ in calls(tickets, ticket) if called == kind]
    return about


def decisions(permission: str):
    def about(context, agent) -> list[Sent]:
        return [Sent(ticket.ref, {"ticket": ticket.n, "title": ticket.title})
                for ticket, waiting in Tickets(context.record, actor=SYSTEM).awaiting_decisions() if waiting == permission]
    return about


def boards_to_check(context, agent) -> list[Sent]:
    """The boards worth looking at: a board whose tickets are all waiting has no agent to check, and asking every five minutes costs the orchestrator a turn each time for nothing."""
    tickets = Tickets(context.record, actor=SYSTEM)
    running = {int(ticket.board) for ticket in tickets.running() if ticket.board}
    boards = [n for n in tickets.orchestrating() if n in running]
    if not boards or all_parked(context.record):
        return []
    if agent.idle_for < float(context.feature.cadence(context.record, "board check").every) * MINUTE:
        return []
    return [Sent(",".join(map(str, boards)), {"about": ", ".join(f"board {n}" for n in boards)})]
