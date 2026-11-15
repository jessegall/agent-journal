from engine.enums.actor_type import ActorType
from engine.enums.access import Access
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag
from core.modules.tasks.agent_messages.task_metadata_reminder_message import TaskMetadataReminderMessage
from core.modules.tasks.agent_messages.task_helper_metadata_reminder_message import TaskHelperMetadataReminderMessage


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
        reminder = TaskHelperMetadataReminderMessage.declared() if self.queries.query(Agent).find(task.creator_id).access == Access.READ else TaskMetadataReminderMessage.declared()
        return reminder.agent_message(task=task.id, missing=" and ".join(missing)).text
