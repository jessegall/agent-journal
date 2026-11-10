from collections.abc import Mapping
from dataclasses import asdict, dataclass

from core.modules.usage.support.plan_window import PlanWindow


@dataclass(frozen=True)
class AgentFacts:
    """What an agent's card says beyond its row: its model and effort, context in use, what its session cost
    so far (none when its program reports no cost), the task it works on, the tasks given to it or held by
    it, whether it waits, is blocked or is at its program's usage limit until its plan allowance starts
    again, the plan allowance windows its program reports to it, and the profile, given name and
    instruction its dispatch gave it."""

    agent_id: int
    model: str
    context_percent: int | None
    cost_dollars: float | None
    task_id: int | None
    task_title: str
    tasks: tuple[Mapping[str, object], ...] = ()
    state: str = ""
    profile: str = ""
    given_name: str = ""
    instruction: str = ""
    effort: str = ""
    job_enabled: bool = False
    job_returned: str = ""
    last_activity: str = ""
    helper_job: str = ""
    helper_job_title: str = ""
    helper_job_program: str = ""
    occupant_launch: str = ""
    profile_title: str = ""
    blocked_reason: str = ""
    work_status: str | None = None
    is_sandbox_off: bool = False
    windows: tuple[PlanWindow, ...] = ()
    usage_limit_ends_at: str | None = None

    def json(self) -> Mapping[str, object]:
        return {"id": self.agent_id, "model": self.model, "effort": self.effort, "context_percent": self.context_percent, "cost_dollars": self.cost_dollars, "task_id": self.task_id, "task_title": self.task_title,
                "job_enabled": self.job_enabled, "tasks": self.tasks, "state": self.state, "profile": self.profile, "profile_title": self.profile_title, "given_name": self.given_name, "instruction": self.instruction, "job_returned": self.job_returned, "last_activity": self.last_activity, "helper_job": self.helper_job, "helper_job_title": self.helper_job_title, "helper_job_program": self.helper_job_program, "occupant_launch": self.occupant_launch, "blocked_reason": self.blocked_reason, "work_status": self.work_status, "sandbox_off": self.is_sandbox_off, "windows": [asdict(window) for window in self.windows], "usage_limit_ends_at": self.usage_limit_ends_at}
