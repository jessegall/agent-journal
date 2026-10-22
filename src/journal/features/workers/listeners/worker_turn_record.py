from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.features.workers.support.worker_chat import WorkerChat
from journal.repositories.workers import Workers


class WorkerTurnRecord(AgentListener[AgentEvent]):
    """At each of a worker's hooks, after the hook is answered, the text it wrote since the last read becomes its messages; its tags stay plain text."""

    is_worker_listener = True

    def __init__(self, chat: WorkerChat, workers: Workers) -> None:
        self.chat, self.workers = chat, workers

    def handle(self, event: AgentEvent) -> None:
        for worker in self.workers.session_worker(event.session):
            self.chat.read(worker)
