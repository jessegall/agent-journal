from journal.features.workers.support.worker_branch import WorkerBranch
from journal.models.agent_role import AgentRole
from journal.models.author import Author
from journal.models.message import Message
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.repositories.messages import Messages
from journal.repositories.workers import Workers
from journal.support.actor import Actor


class WorkerChat:
    """A worker's own chat: what it is told, and each block of text it writes, read from its transcript from where the last read stopped, as messages of its session in a worker's chat."""

    def __init__(self, messages: Messages, workers: Workers, providers: Providers, branch: WorkerBranch) -> None:
        self.messages, self.workers, self.providers, self.branch = messages, workers, providers, branch

    def instruction(self, worker: Worker, text: str, actor: Actor) -> Message:
        return self.messages.save(Message(environment_id=worker.environment_id, author=Author.USER, text=text, session=worker.conversation() or None, agent_role=AgentRole.WORKER), actor)

    def read(self, worker: Worker) -> Worker:
        if not worker.conversation():
            return worker
        blocks = self.providers.lookup(worker.provider).authored_texts(self.branch.place(worker), worker.conversation(), worker.transcript_bytes)
        for i, text in enumerate(blocks.texts):
            self.turn(worker, text, f"transcript:{worker.conversation()}:{worker.transcript_bytes}:{i}")
        return worker if blocks.time == worker.transcript_bytes else self.workers.touch(worker, Actor.system(), transcript_bytes=blocks.time)

    def turn(self, worker: Worker, text: str, key: str) -> None:
        if self.messages.sent_with(key):
            return
        self.messages.save(Message(environment_id=worker.environment_id, author=Author.AGENT, text=text, session=worker.conversation(), agent_role=AgentRole.WORKER, idempotency=key), Actor.agent(worker.conversation()))
