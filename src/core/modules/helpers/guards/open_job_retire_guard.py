from engine.event.updated import Updated
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.agents.support.agent_label import AgentLabel


class OpenJobRetireGuard(Guard[Updated[Agent]]):
    """A helper with an open job is not retired until the job is settled, so its report and reason stay."""

    name = "helpers.open-job-retire"

    def __init__(self, jobs: HelperJobRows) -> None:
        self.jobs = jobs

    def check(self, event: Updated[Agent], context: Context) -> None:
        old_row, row = event.old_row, event.row
        if old_row is None or old_row.retired_at is not None or row.retired_at is None:
            return
        if self.jobs.open_job(row.id) is not None:
            raise Refusal(f"{AgentLabel.labelled(row).text} has an open job", f"journal helper stop {row.number} settles it, then retire it")
