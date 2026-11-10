from collections import defaultdict
from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.waiting_reason import WaitingReason
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.focus.unblocker import Unblocker
from core.modules.plans.support.focus.unblocker_facts import UnblockerFacts
from core.modules.plans.support.focus.unblockers import Unblockers
from core.modules.plans.support.focus.wait_graph import LONGEST_CHAIN, WaitGraph
from core.modules.plans.support.focus.waiting_line import WaitingLine
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.queries.task_query import TaskQuery

GRAPH_REASON = "Every open wait between tasks, read once to follow the waits of a plan in memory instead of one read for each task."
PLAN_REASON = "Every place of the plans the tasks at the end of the waits sit in, to know each plan's working phase and checkpoint."
CIRCLE_TEXT = "which waits in a circle of tasks"
LONG_CHAIN_TEXT = f"whose chain of waits is longer than {LONGEST_CHAIN} tasks"


class PlanUnblockers:
    """Finds what the unfinished tasks of a plan wait on, for one asking agent: the open tasks at the end of
    their waits that the agent can take now, each with the number of plan tasks that wait on it, and a line
    for each task the agent cannot take. It reads the open waits once and follows them in memory."""

    def __init__(self, queries: Queries, tasks: TaskQuery) -> None:
        self.queries, self.tasks = queries, tasks

    def unblockers(self, plan_id: int, agent: Agent) -> Unblockers:
        unfinished_ids = [row.task_id for row in self.queries.query(PlanTask).filter(plan_id=plan_id).full_table(PLAN_REASON).all_rows() if row.state in UNFINISHED_STATES]
        graph = self.wait_graph()
        waiting_tasks: dict[int, set[int]] = defaultdict(set)
        lines: dict[int, WaitingLine] = {}
        for task_id in unfinished_ids:
            for dependency_id in graph.dependencies(task_id):
                ends = graph.ends(dependency_id)
                if ends.has_circle:
                    lines[dependency_id] = WaitingLine(dependency_id, WaitingReason.CIRCLE, CIRCLE_TEXT)
                elif ends.has_long_chain:
                    lines[dependency_id] = WaitingLine(dependency_id, WaitingReason.LONG_CHAIN, LONG_CHAIN_TEXT)
                for end_id in () if ends.has_circle else ends.task_ids:
                    waiting_tasks[end_id].add(task_id)
        end_tasks = self.tasks.matching(Among("id", sorted(waiting_tasks))).all_rows() if waiting_tasks else ()
        facts = self.facts(end_tasks, agent)
        candidates = []
        for task in end_tasks:
            line = facts.waiting_line(task)
            if line is None:
                candidates.append(Unblocker(task.id, len(waiting_tasks[task.id])))
            else:
                lines[task.id] = line
        return Unblockers(tuple(candidates), tuple(lines[task_id] for task_id in sorted(lines)))

    def wait_graph(self) -> WaitGraph:
        waits: dict[int, list[int]] = defaultdict(list)
        for dependency in self.queries.query(OpenDependency).full_table(GRAPH_REASON).all_rows():
            waits[dependency.task_id].append(dependency.dependency_id)
        return WaitGraph(waits)

    def facts(self, end_tasks: Sequence[Task], agent: Agent) -> UnblockerFacts:
        task_ids = [task.id for task in end_tasks]
        if not task_ids:
            return UnblockerFacts(agent, frozenset(), {}, {}, {}, {}, {})
        takeable_ids = frozenset(task.id for task in self.tasks.takeable(agent).matching(Among("id", task_ids)).all_rows())
        places = {row.task_id: row for row in self.queries.query(PlanTask).matching(Among("task_id", task_ids)).all_rows()}
        plan_ids = sorted({row.plan_id for row in places.values()})
        plans = {plan.id: plan for plan in self.queries.query(Plan).matching(Among("id", plan_ids)).all_rows()} if plan_ids else {}
        plan_rows: dict[int, list[PlanTask]] = defaultdict(list)
        for row in self.queries.query(PlanTask).matching(Among("plan_id", plan_ids)).full_table(PLAN_REASON).all_rows() if plan_ids else ():
            plan_rows[row.plan_id].append(row)
        waits: dict[int, list[TaskWait]] = defaultdict(list)
        for wait in self.queries.query(TaskWait).matching(Among("task_id", task_ids)).matching(IsNull("ended_at")).all_rows():
            waits[wait.task_id].append(wait)
        agent_ids = sorted({agent_id for task in end_tasks for agent_id in (task.holder_id, task.delegated_to) if agent_id is not None})
        agents = {row.id: row for row in self.queries.query(Agent).matching(Among("id", agent_ids)).all_rows()} if agent_ids else {}
        return UnblockerFacts(agent, takeable_ids, places, plans, plan_rows, waits, agents)
