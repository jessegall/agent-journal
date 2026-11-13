from collections.abc import Sequence

from engine.database.kept_rows import KeptRows
from engine.plan.plan_authors import PlanAuthors
from engine.plan.plan_edit import PlanEdit
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask

EDITED_ROWS_REASON = "every edit asked about is matched to the plan it belongs to"


class PlanRowAuthors(PlanAuthors):
    """Finds the plans some lines change, through the plan, phase or task each names, and whether the agent made
    every one; the rows of all the lines are read together."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def are_authors(self, agent_id: int, edits: Sequence[PlanEdit]) -> bool:
        plan_ids = self.plan_ids(edits)
        plans = self.plans(sorted({plan_id for plan_id in plan_ids.values() if plan_id is not None}))
        return all(self.is_author(agent_id, plan_ids[edit], plans) for edit in edits)

    @staticmethod
    def is_author(agent_id: int, plan_id: int | None, plans: dict[int, Plan]) -> bool:
        return plan_id is not None and plan_id in plans and plans[plan_id].creator_id == agent_id

    def plans(self, plan_ids: Sequence[int]) -> dict[int, Plan]:
        plans = self.queries.query(Plan).matching(Among("id", list(plan_ids)))
        rows = self.kept.read(plans, lambda: tuple(plans.every_row(EDITED_ROWS_REASON)), name="plans.author_plans")
        return {plan.id: plan for plan in rows}

    def plan_ids(self, edits: Sequence[PlanEdit]) -> dict[PlanEdit, int | None]:
        phases = self.phase_plan_ids([edit.row_id for edit in edits if edit.line.startswith("phase")])
        tasks = self.task_plan_ids([edit.row_id for edit in edits if edit.line.startswith("task")])
        return {edit: self.plan_id_of(edit, phases, tasks) for edit in edits}

    @staticmethod
    def plan_id_of(edit: PlanEdit, phases: dict[int, int], tasks: dict[int, int]) -> int | None:
        if edit.line.startswith("plan"):
            return edit.row_id
        if edit.line.startswith("phase"):
            return phases.get(edit.row_id)
        return tasks.get(edit.row_id)

    def phase_plan_ids(self, phase_ids: Sequence[int]) -> dict[int, int]:
        return {phase.id: phase.plan_id for phase in self.queries.query(Phase).matching(Among("id", phase_ids)).every_row(EDITED_ROWS_REASON)} if phase_ids else {}

    def task_plan_ids(self, task_ids: Sequence[int]) -> dict[int, int]:
        return {place.task_id: place.plan_id for place in self.queries.query(PlanTask).matching(Among("task_id", list(task_ids))).every_row(EDITED_ROWS_REASON)} if task_ids else {}
