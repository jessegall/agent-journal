from collections.abc import Sequence
from typing import TYPE_CHECKING

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.schedules.commands.record_scheduled_job_run.record_scheduled_job_run import RecordScheduledJobRun
from core.modules.schedules.models.scheduled_job import ScheduledJob

if TYPE_CHECKING:
    from engine.agent_machine.decision_record import DecisionRecord

SCHEDULED_JOB_RUN_RULE = "schedules.scheduled-job-run"


class ScheduledJobRunEffect(Effect):
    """A prompt that is the words of one of the agent's open jobs is that job running."""

    events = [HookEventName.PROMPT]
    timing = EffectTiming.UNCONDITIONAL
    replaced_rules = tuple([SCHEDULED_JOB_RUN_RULE])

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def commands(self, view: AgentView, record: "DecisionRecord") -> Sequence[Command[object]]:
        event = record.action.event
        return self.commands_of(event, view.agent.agent_id) if event is not None else []

    def commands_of(self, event: HookEvent, agent_id: int) -> list[Command[object]]:
        prompt = (event.prompt or "").strip()
        jobs = self.queries.query(ScheduledJob).filter(session_agent_id=agent_id).matching(IsNull("ended_at")).get()
        return [RecordScheduledJobRun(job.id) for job in jobs if job.prompt.strip() == prompt]
