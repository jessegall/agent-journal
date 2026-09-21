from engine.events import AgentUpdated
from features.parts import Context, Handler

PERMISSION = "permission"


class ShowWaitingPermission(Handler):
    def handle(self, context: Context, event: AgentUpdated) -> None:
        if not context.agent or context.agent.row.subagent:
            return
        session = context.agent.session
        waiting = [n for n in context.journal.notices._standing() if n.data.get("action") == PERMISSION and n.data.get("session") == session]
        asking = context.agent.row.asking or {}
        if asking and not waiting:
            context.journal.notice("waiting", tool=asking.get("tool") or "", call=asking.get("call") or "", tone="warn", session=session, action=PERMISSION)
        elif not asking:
            for notice in waiting:
                context.journal.clear(notice, "answered")
