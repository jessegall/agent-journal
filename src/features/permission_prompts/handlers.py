from events import Fact
from events.agents import AgentReported
from events.permission_prompts import PermissionAnswered, PermissionAsked
from features.permission_prompts.routing import orchestrator_of
from payload import Asking
from receiving import Handler, Listener
from resources.types import AgentRow, Notice
from serving import Chat, Elsewhere, ReadRows, Rows

PERMISSION = "permission"
ORCHESTRATOR = "orchestrator"


class SpotPermissionAsk(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], notices: ReadRows[Notice]) -> list[Fact]:
        row = agents.peek(event.agent)
        if row.subagent:
            return []
        waiting = [n for n in notices.rows.standing() if n.data.get("action") == PERMISSION and n.data.get("session") == row.title]
        asking = Asking.of(row.asking)
        if asking:
            return [] if waiting else [PermissionAsked(agent=event.agent, session=row.title, tool=asking.tool, call=asking.call)]
        return [PermissionAnswered(notice=notice.n) for notice in waiting]


class ShowTheAsk(Handler[PermissionAsked]):
    def handle(self, event: PermissionAsked, chat: Chat, elsewhere: Elsewhere) -> list[Fact]:
        here = elsewhere.here()
        launcher = orchestrator_of(here.record)
        chat.notice("waiting", tool=event.tool, call=event.call, tone="warn", session=event.session, action=PERMISSION, to=ORCHESTRATOR if launcher else "")
        if launcher:
            elsewhere.named(launcher.env).chat().say("routed", environment=here.record.env, tool=event.tool, call=event.call)
        return []


class ClearTheAsk(Handler[PermissionAnswered]):
    def handle(self, event: PermissionAnswered, notices: Rows[Notice]) -> list[Fact]:
        notices.complete(event.notice, how="answered")
        return []
