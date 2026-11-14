from pathlib import Path

from engine.provider.providers import Providers
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.task import Task

LAST_REPLY_LIMIT_CHARACTERS = 1000


class WorkerStopDetail:
    """What opening the mark of a stopped or stuck worker shows: the tasks it has left, the task it was on and
    the last thing it wrote."""

    def __init__(self, queries: Queries, providers: Providers) -> None:
        self.queries, self.providers = queries, providers

    def text(self, worker: Agent, tasks: tuple[Task, ...]) -> str:
        names = ", ".join(f"task {task.id}" for task in tasks)
        folder = Path(self.queries.query(Environment).find(worker.environment_id).folder)
        reply = self.providers.provider(worker.program).last_reply(folder, worker.session)
        parts = (f"Tasks left: {names}" if tasks else "", f"Task {tasks[0].id}: {tasks[0].title}" if tasks else "", f"Last words: {reply[:LAST_REPLY_LIMIT_CHARACTERS]}" if reply else "")
        return "\n\n".join(part for part in parts if part)
