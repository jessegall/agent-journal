from engine import viewer
from features import trigger
from features.base import Feature, on


class TabFocus(Feature):
    name = "tabfocus"
    SHOWN = "shown"
    title_ = "One viewer tab"
    abstract_ = "A journal launch shows its viewer tab once the agent's session has started, focusing an existing tab instead of opening another"
    help_ = "Always on: the tab opens when the session starts, after any startup or resume menu is answered; macOS focuses a matching tab in a running browser; other systems and missing tabs use the normal browser opener."
    fixed = True

    @on("agent.created")
    @on("agent.updated")
    def started(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent.event != "SessionStart" or agent.parent or trigger.last(record, agent.title, self.name).get(self.SHOWN):
            return
        url = viewer.running(record.root)
        if not url:
            return
        trigger.write(record, agent, self.name, shown=True)
        viewer.show(url)
