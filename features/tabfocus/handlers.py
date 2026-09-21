from engine import viewer
from engine.events import AgentChanged
from features import trigger
from features.parts import Context, Handler

SHOWN = "shown"
WRITTEN = ("created", "updated")


class ShowViewerTab(Handler):
    def handle(self, context: Context, event: AgentChanged) -> None:
        row = context.agent.row if context.agent else None
        if event.action not in WRITTEN or not row or row.event != "SessionStart" or row.parent:
            return
        if trigger.last(context.record, row.title, context.feature.name).get(SHOWN):
            return
        url = viewer.running(context.record.root)
        if not url:
            return
        trigger.write(context.record, row, context.feature.name, **{SHOWN: True})
        viewer.show(url)
