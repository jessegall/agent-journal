from engine import viewer
from engine.events.resources import AgentChanged
from features.parts import AgentContext, Handler, in_background
from providers.payload import HookEvent


class ShowViewerTab(Handler):
    def handle(self, context: AgentContext, event: AgentChanged) -> None:
        row = context.agent.row
        if not (event.written or event.action == "reported") or row.event != HookEvent.SESSION_START or row.parent or in_background(context.record):
            return
        url = viewer.lately_running(context.record.root)
        if not url or not context.once("viewer opened", row.title):
            return
        viewer.show(url, context.record.env)
