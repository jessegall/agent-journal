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

TASK = "task"
PLAN = "plan"
TARGET_KINDS = {"tasks": TASK, "plans": PLAN}


@dataclass(frozen=True)
class WaitNode:
    """A task or a plan in the waits that hold work back."""

    kind: str
    row_id: int

    @property
    def text(self) -> str:
        return f"{self.kind} {self.row_id}"


class WaitCircle:
    """Finds the circle a new wait would close through tasks and plans: a task waits on a task or a plan, a plan on
    a plan, and a plan on its own unfinished tasks. A wait that comes back to the one that waits never ends."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def closed_by(self, waiter: WaitNode, target: WaitNode) -> tuple[WaitNode, ...]:
        if waiter == target:
            return ()
        parents: dict[WaitNode, WaitNode | None] = {target: None}
        frontier = [target]
        while frontier and waiter not in parents:
            reached = []
            for node, after in self.next_nodes(frontier):
                if after not in parents:
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
        task_ids = {node.row_id: node for node in nodes if node.kind == TASK}
        plan_ids = {node.row_id: node for node in nodes if node.kind == PLAN}
        found: list[tuple[WaitNode, WaitNode]] = []
        if task_ids:
            for edge in self.queries.query(TaskEdge).matching(Among("task_id", list(task_ids))).all_rows():
                found.append((task_ids[edge.task_id], WaitNode(TASK, edge.blocker_id)))
            for wait in self.queries.query(TaskWait).matching(Among("task_id", list(task_ids))).matching(IsNull("ended_at")).all_rows():
                kind, _, row_id = wait.target.partition(":")
                if kind in TARGET_KINDS and row_id.isdigit():
                    found.append((task_ids[wait.task_id], WaitNode(TARGET_KINDS[kind], int(row_id))))
        if plan_ids:
            for wait in self.queries.query(PlanWait).matching(Among("plan_id", list(plan_ids))).matching(IsNull("ended_at")).all_rows():
                found.append((plan_ids[wait.plan_id], WaitNode(PLAN, wait.blocker_id)))
            for place in self.queries.query(PlanTask).matching(Among("plan_id", list(plan_ids))).matching(Among("state", list(UNFINISHED_STATES))).all_rows():
                found.append((plan_ids[place.plan_id], WaitNode(TASK, place.task_id)))
        return found

    def refuse_circle(self, waiter: WaitNode, target: WaitNode) -> None:
        circle = self.closed_by(waiter, target)
        if circle:
            raise Refusal(f"this wait would never end, it closes a circle: {' -> '.join(node.text for node in circle)}",
                          "end one of the waits in that circle first")
