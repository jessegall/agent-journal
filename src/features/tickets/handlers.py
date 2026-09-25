import time

from engine.actors import IDLE
from engine.events import ClockTicked, ResourceCreated
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from features.tickets.controller import HELD, Tickets
from features.sequences.orchestration import ORCHESTRATION
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
        self.check_on_board(context)

    def check_on_board(self, context: AgentContext) -> None:
        found = context.journal.sequences._in_hand()
        row = context.agent.row
        if not found or found[0].title != ORCHESTRATION["title"] or row.status != IDLE:
            return
        quiet = time.time() - float(row.at)
        if quiet >= CHECK_AFTER and context.once("check_board", f"{found[1]}|{int(row.at)}|{int(quiet // CHECK_AFTER)}"):
            context.agent.whisper("check_board", about=found[1].split("|", 1)[-1].replace(":", " "))
        for ticket in tickets._awaiting_orchestrator():
            if context.once("plan_waits", f"{ticket.ref}|{ticket.plan}"):
                context.agent.whisper("plan_waits", ticket=ticket.n, title=ticket.title, env=ticket.work_environment, plan=ticket.plan)


class HoldTicketKnowledge(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in HELD:
            Tickets(context.record, actor=SYSTEM).hold(event.type, event.n)
