from engine.enums.actor_type import ActorType
from engine.enums.access import Access
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag
from core.modules.tasks.support.task_nudges import TASK_METADATA_REMINDER, TASK_HELPER_METADATA_REMINDER


class TaskMetadataReminder:
    """Names missing task tags and complexity after an agent creates a task."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def text(self, task: Task) -> str:
        if self.queries.query(ActorRecord).find(task.creator_id).type is not ActorType.AGENT:
            return ""
        has_tags = self.queries.query(TaskTag).filter(task_id=task.id).exists()
        missing = [name for name, is_missing in (("tags", not has_tags), ("complexity", task.complexity is None)) if is_missing]
        if not missing:
            return ""
        reminder = TASK_HELPER_METADATA_REMINDER if self.queries.query(Agent).find(task.creator_id).access == Access.READ else TASK_METADATA_REMINDER
        return reminder.nudge(task=task.id, missing=" and ".join(missing)).text
