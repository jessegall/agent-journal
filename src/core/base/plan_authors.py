PLAN_AUTHOR_LINES = ("plan edit", "plan ready", "phase edit", "task edit", "task depend", "task comment")


class PlanAuthors:
    """Whether an agent made the plan a journal line changes, so a read-only helper that wrote a plan may still edit
    it, link its tasks and mark it ready; answered by the module that keeps plans, and never so without one."""

    def is_author(self, agent_id: int, line: str, row_id: int) -> bool:
        return False
