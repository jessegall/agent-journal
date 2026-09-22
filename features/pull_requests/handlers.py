from engine.events import ToolFinished
from features.parts import AgentContext, Handler
from features.pull_requests.details import OPEN

OPENED = "create"


class PinPullRequests(Handler):
    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        ran = next((c for c in reversed(context.agent.row.commands) if c.get("done")), None)
        pull = (ran or {}).get("result") or {}
        if not pull.get("pull") or not context.state.claim(f"pull {ran['at']}", ran["at"]):
            return
        if pull["pull"] == OPENED and pull["url"]:
            context.journal.notice(OPEN, number=pull["number"], link=pull["url"], label="Open the pull request", pull=pull["number"], tone="note")
            return
        for notice in context.journal.notices._standing():
            if notice.data.get("pull") and (not pull["number"] or notice.data.get("pull") == pull["number"]):
                context.journal.clear(notice, f"pull request {pull['pull']}d")
