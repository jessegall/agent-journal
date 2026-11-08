from core.base.actor_type import ActorType
from core.base.access import Access
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag
from core.modules.tasks.models.task_tag_word import TaskTagWord
from core.modules.tasks.support.task_nudges import TASK_METADATA_REMINDER, TASK_HELPER_METADATA_REMINDER


class TaskMetadataReminder:
    """Names missing task tags and complexity after an agent creates a task."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def text(self, task: Task) -> str:
        if self.queries.query(ActorRecord).find(task.creator_id).type is not ActorType.AGENT:
            return ""
        has_tags = self.queries.query(TaskTag).filter(task_id=task.id).exists()
        missing = []
        tag_command = ""
        score_command = ""
        if not has_tags:
            missing.append("tags")
            title_tokens = [tag.word for tag in self.queries.query(TaskTagWord).ordered("word").all_rows() if tag.word.casefold() in task.title.casefold()][:3]
            suggested = " ".join(title_tokens) if title_tokens else "<words>"
            tag_command = f"journal task tag {task.id} {suggested}"
        if task.complexity is None:
            missing.append("complexity")
            score_command = f"{'; ' if tag_command else ''}journal task edit {task.id} --complexity <1-5>"
        if not missing:
            return ""
        if self.queries.query(Agent).find(task.creator_id).access == Access.READ:
            options = ["--tag <word>" if name == "tags" else "--complexity <1-5>" for name in missing]
            return TASK_HELPER_METADATA_REMINDER.nudge(task=task.id, missing=" and ".join(missing), options=" ".join(options)).text
        return TASK_METADATA_REMINDER.nudge(task=task.id, missing=" and ".join(missing), tag_command=tag_command, score_command=score_command).text
