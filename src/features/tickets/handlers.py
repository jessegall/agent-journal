import time

from engine.actors import IDLE
from engine.events import ClockTicked, ResourceCreated
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from features.tickets.controller import HELD, Tickets
from resources.base import SYSTEM

CHECK_AFTER = 300


class LookAfterTicketBranches(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        tickets.keep_branches()
        tickets.close_merged()
        tickets.start_queued()
        tickets._stop_orphaned()
        for ticket in tickets._awaiting_orchestrator():
            if context.once("plan_waits", f"{ticket.ref}|{ticket.plan}|{tickets._plans(ticket).load(int(ticket.plan)).updated}"):
                context.agent.whisper("plan_waits", ticket=ticket.n, title=ticket.title, env=ticket.work_environment, plan=ticket.plan)
        self.check_on_board(context, tickets)

    def check_on_board(self, context: AgentContext, tickets: Tickets) -> None:
        row = context.agent.row
        boards = tickets._orchestrating()
        if not boards or row.status != IDLE:
            return
        quiet = time.time() - float(row.at)
        if quiet >= CHECK_AFTER and context.once("check_board", f"{boards}|{int(row.at)}|{int(quiet // CHECK_AFTER)}"):
            context.agent.whisper("check_board", about=", ".join(f"board {n}" for n in boards))


class HoldTicketKnowledge(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in HELD:
            Tickets(context.record, actor=SYSTEM).hold(event.type, event.n)
