from collections import defaultdict
from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.assignments.support.assignments import Assignments
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.unblockers.plan_wait_walk import PlanWaitWalk
from core.modules.plans.support.unblockers.unblocker_facts import UnblockerFacts
from core.modules.plans.support.unblockers.unblockers import Unblockers
from core.modules.plans.support.unblockers.wait_graph import WaitGraph
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES, TaskState
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.queries.task_query import TaskQuery

WALK_REASON = "the unblockers read every task, plan, wait and agent the waiting walk names"

GRAPH_REASON = "Every open wait between tasks, read once to follow the waits of a plan in memory instead of one read for each task."
PLAN_REASON = "Every place of the plans the tasks at the end of the waits sit in, to know each plan's working phase and checkpoint."


class PlanUnblockers:
    """Finds what the unfinished tasks of a plan wait on, for one asking agent: the open tasks at the end of
    their waits that the agent can take now, each with the number of plan tasks that wait on it, and a line
    for each task the agent cannot take. It reads the open waits once and follows them in memory."""

    def __init__(self, queries: Queries, tasks: TaskQuery, assignments: Assignments) -> None:
        self.queries, self.tasks, self.assignments = queries, tasks, assignments

    def unblockers(self, plan_id: int, agent: Agent) -> Unblockers:
        return self.plan_unblockers([plan_id], agent)[plan_id]

    def plan_unblockers(self, plan_ids: Sequence[int], agent: Agent) -> dict[int, Unblockers]:
        if not plan_ids:
            return {}
        unfinished_ids: dict[int, list[int]] = defaultdict(list)
        blocked_ids: dict[int, list[int]] = defaultdict(list)
        plan_rows: dict[int, list[PlanTask]] = defaultdict(list)
        for row in self.queries.query(PlanTask).matching(Among("plan_id", plan_ids)).every_row(PLAN_REASON):
            plan_rows[row.plan_id].append(row)
            if row.state in UNFINISHED_STATES:
                unfinished_ids[row.plan_id].append(row.task_id)
            if row.state is TaskState.BLOCKED:
                blocked_ids[row.plan_id].append(row.task_id)
        graph = self.wait_graph()
        walks = {plan_id: PlanWaitWalk.walked(unfinished_ids[plan_id], graph, blocked_ids[plan_id]) for plan_id in plan_ids}
        end_ids = sorted({task_id for walk in walks.values() for task_id in walk.waiting_tasks})
        end_tasks = {task.id: task for task in self.tasks.unclosed().matching(Among("id", end_ids)).every_row(WALK_REASON)} if end_ids else {}
        facts = self.facts(tuple(end_tasks.values()), agent, plan_rows)
        return {plan_id: walk.unblockers(end_tasks, facts) for plan_id, walk in walks.items()}

    def wait_graph(self) -> WaitGraph:
        waits: dict[int, list[int]] = defaultdict(list)
        for dependency in self.queries.query(OpenDependency).every_row(GRAPH_REASON):
            waits[dependency.task_id].append(dependency.dependency_id)
        return WaitGraph(waits)

    def facts(self, end_tasks: Sequence[Task], agent: Agent, plan_rows: dict[int, list[PlanTask]]) -> UnblockerFacts:
        task_ids = [task.id for task in end_tasks]
        if not task_ids:
            return UnblockerFacts(agent, frozenset(), {}, {}, {}, {}, {}, {})
        takeable_ids = frozenset(task.id for task in self.tasks.takeable(agent).matching(Among("id", task_ids)).every_row(WALK_REASON))
        places = {row.task_id: row for rows in plan_rows.values() for row in rows if row.task_id in task_ids}
        unplaced_ids = [task_id for task_id in task_ids if task_id not in places]
        for row in self.queries.query(PlanTask).matching(Among("task_id", unplaced_ids)).every_row(WALK_REASON) if unplaced_ids else ():
            places[row.task_id] = row
        plan_ids = sorted({row.plan_id for row in places.values()})
        plans = {plan.id: plan for plan in self.queries.query(Plan).matching(Among("id", plan_ids)).every_row(WALK_REASON)} if plan_ids else {}
        unread_plan_ids = [plan_id for plan_id in plan_ids if plan_id not in plan_rows]
        for row in self.queries.query(PlanTask).matching(Among("plan_id", unread_plan_ids)).every_row(PLAN_REASON) if unread_plan_ids else ():
            plan_rows[row.plan_id].append(row)
        waits: dict[int, list[TaskWait]] = defaultdict(list)
        for wait in self.queries.query(TaskWait).matching(Among("task_id", task_ids)).matching(IsNull("ended_at")).every_row(WALK_REASON):
            waits[wait.task_id].append(wait)
        assignees = {task_id: actor_ids[0] for task_id, actor_ids in self.assignments.row_actor_ids(Task, task_ids).items() if actor_ids}
        agent_ids = sorted({*(task.holder_id for task in end_tasks if task.holder_id is not None), *assignees.values()})
        agents = {row.id: row for row in self.queries.query(Agent).matching(Among("id", agent_ids)).every_row(WALK_REASON)} if agent_ids else {}
        return UnblockerFacts(agent, takeable_ids, places, plans, plan_rows, waits, agents, assignees)
