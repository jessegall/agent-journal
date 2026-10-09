from controllers.types import Agents, Notices
from engine.events.agents import AgentReported
from features.parts import AgentContext, Handler
from features.permission_prompts.routing import orchestrator_of
from providers.payload import Asking
from resources.base import SYSTEM

PERMISSION = "permission"
ORCHESTRATOR = "orchestrator"


class ShowWaitingPermission(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if context.agent.row.subagent:
            return
        session = context.agent.session
        waiting = [n for n in context.journal.get(Notices).rows.standing() if n.data.get("action") == PERMISSION and n.data.get("session") == session]
        asking = Asking.of(context.agent.row.asking)
        if asking and not waiting:
            self.ask(context, asking, session)
        elif not asking:
            for notice in waiting:
                context.journal.clear(notice, "answered")

    def ask(self, context: AgentContext, asking: Asking, session: str) -> None:
        orchestrator = orchestrator_of(context.record)
        context.journal.notice("waiting", tool=asking.tool, call=asking.call, tone="warn", session=session, action=PERMISSION, to=ORCHESTRATOR if orchestrator else "")
        main = Agents(orchestrator, actor=SYSTEM).primary_to_read() if orchestrator else None
        if main:
            context.journal.journal.say(orchestrator, main, "routed", environment=context.record.env, tool=asking.tool, call=asking.call)
