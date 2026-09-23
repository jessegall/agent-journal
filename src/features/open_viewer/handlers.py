from engine import viewer
from engine.events import AgentChanged
from features import trigger
from features.parts import AgentContext, Handler

WRITTEN = ("created", "updated", "reported")


class ShowViewerTab(Handler):
    def handle(self, context: AgentContext, event: AgentChanged) -> None:
        row = context.agent.row
        if event.action not in WRITTEN or row.event != "SessionStart" or row.parent:
            return
        if trigger.last(context.record, row.title, context.feature.name).viewer_opened:
            return
        url = viewer.running(context.record.root)
        if not url:
            return
        trigger.write(context.record, row, context.feature.name, viewer_opened=True)
        viewer.show(url, context.record.env)
