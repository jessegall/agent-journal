from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent
from journal.models.open_task import OpenTask
from journal.models.support.worker_task import WorkerTask


@dataclass(frozen=True)
class CommitDetected(AgentEvent):
    """The agent made a commit, seen at the head after its command ran, by its sha: the tasks its message closed, the task open next when the close left one, and the tasks it named that a worker holds, which it leaves open. What the states say of it rides the reply of the command that committed, so it is never typed."""

    answers_hook: ClassVar[bool] = True

    sha: str
    closed: tuple[int, ...] = ()
    next_open: OpenTask | None = None
    worker_tasks: tuple[WorkerTask, ...] = ()

    def short_sha(self) -> str:
        return self.sha[:8]

    def closed_words(self) -> str:
        return ", ".join(f"task {n}" for n in self.closed)
