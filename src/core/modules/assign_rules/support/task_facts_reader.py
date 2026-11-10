from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.assign_rules.models.enums.creator_type import CreatorType
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag


class TaskFactsReader:
    """Reads what a rule's conditions need to know about a task: its text, score, tags, creator and plan."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, task: Task) -> TaskFacts:
        plan_task = self.queries.query(PlanTask).filter(task_id=task.id).first()
        return TaskFacts(title=task.title, brief=task.brief, complexity=task.complexity, priority=task.priority, tags=tuple(tag.word for tag in self.queries.query(TaskTag).filter(task_id=task.id).all_rows()),
                         creator_type=self.creator_type(task.creator_id), creator_id=task.creator_id, plan_id=None if plan_task is None else plan_task.plan_id)

    def creator_type(self, creator_id: int) -> CreatorType:
        actor_type = self.queries.query(ActorRecord).find(creator_id).type
        if actor_type is ActorType.USER:
            return CreatorType.PERSON
        if actor_type is not ActorType.AGENT:
            return CreatorType.JOURNAL
        return CreatorType.MAIN_AGENT if self.queries.query(Agent).find(creator_id).role == AgentRole.MAIN else CreatorType.HELPER
