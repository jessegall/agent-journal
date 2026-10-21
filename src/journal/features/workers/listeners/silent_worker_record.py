from journal.events.agent.line_delivered import LineDelivered
from journal.events.agent_listener import AgentListener
from journal.repositories.workers import Workers
from journal.support.actor import Actor


class SilentWorkerRecord(AgentListener[LineDelivered]):
    """A silent worker named to the agent is marked reported on its row, so its silence is told once; its next send, notify or report starts a new span."""

    def __init__(self, workers: Workers) -> None:
        self.workers = workers

    def handle(self, event: LineDelivered) -> None:
        from journal.features.workers.feature import Workers as Feature
        if event.nudge != Feature.SILENT_WORKER.key:
            return
        self.workers.touch(self.workers.find(int(event.values["n"])), Actor.system(), silence_reported=True)
