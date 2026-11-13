from collections.abc import Iterable
from dataclasses import dataclass

from engine.errors.refusal import Refusal
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.models.plan_wait import PlanWait
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES
from core.modules.tasks.models.task_edge import TaskEdge
from core.modules.tasks.models.task_wait import TaskWait

WAITS_REASON = "a circle is found only by following every wait of the tasks and plans reached"
TASK = "task"
PLAN = "plan"
TARGET_TYPES = {"tasks": TASK, "plans": PLAN}


@dataclass(frozen=True)
class WaitNode:
    """A task or a plan in the waits that hold work back."""

    node_type: str
    row_id: int

    @property
    def text(self) -> str:
        return f"{self.node_type} {self.row_id}"


class WaitCircle:
    """Finds the circle a new wait would close through tasks and plans: a task waits on a task or a plan, a plan on
    a plan, and a plan on its own unfinished tasks. A wait that comes back to the one that waits never ends. The walk
    goes back from the one that waits through what waits on it, so many new waits on one target each read their own
    rows."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def find_circle(self, waiter: WaitNode, target: WaitNode) -> tuple[WaitNode, ...]:
        if waiter == target:
            return ()
        children: dict[WaitNode, WaitNode | None] = {waiter: None}
        frontier = [waiter]
        while frontier and target not in children:
            reached = []
            for node, before in self.waiting_on(frontier):
                if before in children:
                    continue
                children[before] = node
                reached.append(before)
            frontier = reached
        if target not in children:
            return ()
        path = [target]
        while path[-1] != waiter:
            path.append(children[path[-1]])
        return (waiter, *path)

    def waiting_on(self, frontier: Iterable[WaitNode]) -> list[tuple[WaitNode, WaitNode]]:
        nodes = tuple(frontier)
        task_ids = {node.row_id: node for node in nodes if node.node_type == TASK}
        plan_ids = {node.row_id: node for node in nodes if node.node_type == PLAN}
        targets = {f"{prefix}:{node.row_id}": node for node in nodes for prefix, node_type in TARGET_TYPES.items() if node.node_type == node_type}
        edges: list[tuple[WaitNode, WaitNode]] = []
        if task_ids:
            for edge in self.queries.query(TaskEdge).matching(Among("blocker_id", list(task_ids))).every_row(WAITS_REASON):
                edges.append((task_ids[edge.blocker_id], WaitNode(TASK, edge.task_id)))
            for place in self.queries.query(PlanTask).matching(Among("task_id", list(task_ids))).matching(Among("state", list(UNFINISHED_STATES))).every_row(WAITS_REASON):
                edges.append((task_ids[place.task_id], WaitNode(PLAN, place.plan_id)))
        if targets:
            for wait in self.queries.query(TaskWait).matching(Among("target", list(targets))).matching(IsNull("ended_at")).every_row(WAITS_REASON):
                edges.append((targets[wait.target], WaitNode(TASK, wait.task_id)))
        if plan_ids:
            for wait in self.queries.query(PlanWait).matching(Among("blocker_id", list(plan_ids))).matching(IsNull("ended_at")).every_row(WAITS_REASON):
                edges.append((plan_ids[wait.blocker_id], WaitNode(PLAN, wait.plan_id)))
        return edges

    def refuse_circle(self, waiter: WaitNode, target: WaitNode) -> None:
        circle = self.find_circle(waiter, target)
        if circle:
            raise Refusal(f"this wait would never end, it closes a circle: {' -> '.join(node.text for node in circle)}",
                          "end one of the waits in that circle first")
