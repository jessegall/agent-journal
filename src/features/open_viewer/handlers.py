from engine import viewer
from engine.events.resources import AgentChanged
from features import trigger
from features.parts import AgentContext, Handler, in_background


class ShowViewerTab(Handler):
    def handle(self, context: AgentContext, event: AgentChanged) -> None:
        row = context.agent.row
        if not (event.written or event.action == "reported") or row.event != "SessionStart" or row.parent or in_background(context.record):
            return
        if trigger.last(context.record, row.title, context.feature.name).viewer_opened:
            return
        url = viewer.running(context.record.root)
        if not url:
            return
        trigger.write(context.record, row, context.feature.name, viewer_opened=True)
        viewer.show(url, context.record.env)
