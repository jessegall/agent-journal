from engine.events import ClockTicked, ResourceCreated
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from features.tickets.controller import HELD, Tickets
from resources.base import SYSTEM


class LookAfterTicketBranches(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        tickets.keep_branches()
        tickets.close_merged()
        tickets.start_queued()
        for ticket in tickets._awaiting_orchestrator():
            if context.once("plan_waits", f"{ticket.ref}|{ticket.plan}"):
                context.agent.whisper("plan_waits", ticket=ticket.n, title=ticket.title, env=ticket.work_environment, plan=ticket.plan)


class HoldTicketKnowledge(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in HELD:
            Tickets(context.record, actor=SYSTEM).hold(event.type, event.n)
