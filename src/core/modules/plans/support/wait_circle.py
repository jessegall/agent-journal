from collections.abc import Iterable

from engine.errors.refusal import Refusal
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.database.kept_rows import KeptRows
from engine.query.query import Query
from engine.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.models.plan_wait import PlanWait
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.plans.support.wait_node import WaitNode

WAITS_REASON = "a circle is found only by following every wait of the tasks and plans reached"
TASK = "task"
PLAN = "plan"
TARGET_TYPES = {"tasks": TASK, "plans": PLAN}


class WaitCircle:
    """Finds the circle a new wait would close through tasks and plans: a task waits on a task or a plan, a plan on
    a plan, and a plan on its own unfinished tasks. A wait that comes back to the one that waits never ends. Each
    step's rows are kept for the request, so many new waits on one target walk it once."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def find_circle(self, waiter: WaitNode, target: WaitNode) -> tuple[WaitNode, ...]:
        if waiter == target:
            return ()
        parents: dict[WaitNode, WaitNode | None] = {target: None}
        frontier = [target]
        while frontier and waiter not in parents:
            reached = []
            for node, after in self.next_nodes(frontier):
                if after in parents:
                    continue
                parents[after] = node
                reached.append(after)
            frontier = reached
        if waiter not in parents:
            return ()
        path = [waiter]
        while path[-1] != target:
            path.append(parents[path[-1]])
        return (waiter, *reversed(path))

    def next_nodes(self, frontier: Iterable[WaitNode]) -> list[tuple[WaitNode, WaitNode]]:
        nodes = tuple(frontier)
        task_ids = {node.row_id: node for node in nodes if node.node_type == TASK}
        plan_ids = {node.row_id: node for node in nodes if node.node_type == PLAN}
        edges: list[tuple[WaitNode, WaitNode]] = []
        if task_ids:
            for dependency in self.rows(self.queries.query(TaskDependency).matching(Among("task_id", list(task_ids))), "dependencies"):
                edges.append((task_ids[dependency.task_id], WaitNode(TASK, dependency.dependency_id)))
            for wait in self.rows(self.queries.query(TaskWait).matching(Among("task_id", list(task_ids))).matching(IsNull("ended_at")), "task_waits"):
                target_type, _, row_id = wait.target.partition(":")
                if target_type in TARGET_TYPES and row_id.isdigit():
                    edges.append((task_ids[wait.task_id], WaitNode(TARGET_TYPES[target_type], int(row_id))))
        if plan_ids:
            for wait in self.rows(self.queries.query(PlanWait).matching(Among("plan_id", list(plan_ids))).matching(IsNull("ended_at")), "plan_waits"):
                edges.append((plan_ids[wait.plan_id], WaitNode(PLAN, wait.blocker_id)))
            for place in self.queries.query(PlanTask).matching(Among("plan_id", list(plan_ids))).matching(Among("state", list(UNFINISHED_STATES))).every_row(WAITS_REASON):
                edges.append((plan_ids[place.plan_id], WaitNode(TASK, place.task_id)))
        return edges

    def rows[RowType](self, query: Query[RowType], name: str) -> tuple[RowType, ...]:
        return self.kept.read(query, lambda: tuple(query.every_row(WAITS_REASON)), name=f"plans.wait_circle.{name}")

    def refuse_circle(self, waiter: WaitNode, target: WaitNode) -> None:
        circle = self.find_circle(waiter, target)
        if circle:
            raise Refusal(f"this wait would never end, it closes a circle: {' -> '.join(node.text for node in circle)}",
                          "end one of the waits in that circle first")
