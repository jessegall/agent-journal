from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.schedules.commands.record_scheduled_job_run.record_scheduled_job_run import RecordScheduledJobRun
from core.modules.schedules.models.scheduled_job import ScheduledJob


class ScheduledJobRunRule(DriverRule):
    """A prompt that is the words of one of the agent's open jobs is that job running."""

    name = "schedules.scheduled-job-run"
    hook = HookEventName.PROMPT
    drivers = ["*"]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        prompt = (hook.event.prompt or "").strip()
        jobs = self.queries.query(ScheduledJob).filter(session_agent_id=hook.agent_id).matching(IsNull("ended_at")).all_rows()
        return RuleAnswer.allowed().running(*(RecordScheduledJobRun(job.id) for job in jobs if job.prompt.strip() == prompt))
