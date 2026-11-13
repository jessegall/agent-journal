from collections.abc import Sequence

from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.assign_rules.models.enums.creator_type import CreatorType
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag

PLAN_TASKS_REASON = "the plan of each task judged is read in one query"
TAGS_REASON = "the tags of each task judged are read in one query"


class TaskFactsReader:
    """Reads what a rule's conditions need to know about tasks: their text, score, tags, creator and plan, with one
    query for each of those over all the tasks asked about."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, task: Task) -> TaskFacts:
        return self.read_many([task])[0]

    def read_many(self, tasks: Sequence[Task]) -> list[TaskFacts]:
        task_ids = [task.id for task in tasks]
        plan_ids = {plan_task.task_id: plan_task.plan_id for plan_task in self.queries.query(PlanTask).where_in("task_id", task_ids).every_row(PLAN_TASKS_REASON)}
        tags: dict[int, list[str]] = {}
        for tag in self.queries.query(TaskTag).where_in("task_id", task_ids).every_row(TAGS_REASON):
            tags.setdefault(tag.task_id, []).append(tag.word)
        creator_types = self.creator_types([task.creator_id for task in tasks])
        return [TaskFacts(title=task.title, brief=task.brief, complexity=task.complexity, priority=task.priority, tags=tuple(tags.get(task.id, [])),
                          creator_type=creator_types[task.creator_id], creator_id=task.creator_id, plan_id=plan_ids.get(task.id)) for task in tasks]

    def creator_type(self, creator_id: int) -> CreatorType:
        return self.creator_types([creator_id])[creator_id]

    def creator_types(self, creator_ids: Sequence[int]) -> dict[int, CreatorType]:
        actors = self.queries.query(ActorRecord).find_many(list(dict.fromkeys(creator_ids)))
        agent_ids = [actor.id for actor in actors if actor.type is ActorType.AGENT]
        main_ids = {agent.id for agent in self.queries.query(Agent).find_many(agent_ids) if agent.role == AgentRole.MAIN}
        return {actor.id: self.actor_creator_type(actor, main_ids) for actor in actors}

    @staticmethod
    def actor_creator_type(actor: ActorRecord, main_ids: set[int]) -> CreatorType:
        if actor.type is ActorType.USER:
            return CreatorType.PERSON
        if actor.type is not ActorType.AGENT:
            return CreatorType.JOURNAL
        return CreatorType.MAIN_AGENT if actor.id in main_ids else CreatorType.HELPER
