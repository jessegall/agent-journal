from collections.abc import Sequence
from engine.plan.plan_edit import PlanEdit

PLAN_AUTHOR_LINES = ("plan edit", "plan ready", "phase edit", "task edit", "task depend", "task waits-on-nothing", "task comment")


class PlanAuthors:
    """Whether an agent made every plan some journal lines change, so a read-only helper that wrote a plan may
    still edit it, link its tasks and mark it ready; answered by the module that keeps plans, and never so
    without one."""

    def are_authors(self, agent_id: int, edits: Sequence[PlanEdit]) -> bool:
        return False
