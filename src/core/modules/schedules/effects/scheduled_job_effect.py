import re
from collections.abc import Sequence
from typing import TYPE_CHECKING

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job import EndScheduledJob
from core.modules.schedules.commands.record_scheduled_job.record_scheduled_job import RecordScheduledJob

if TYPE_CHECKING:
    from engine.agent_machine.decision_record import DecisionRecord

SCHEDULED_JOB_KEY = "schedules.scheduled-job"
SCHEDULE_TOOL = "CronCreate"
REMOVAL_TOOL = "CronDelete"
JOB_ID = re.compile(r"\b[0-9a-f]{8}\b")


class ScheduledJobEffect(Effect):
    """Keeps each job an agent schedules, with the id its tool's answer names, and ends each it deletes."""

    events = [HookEventName.POST_TOOL_USE]
    timing = EffectTiming.UNCONDITIONAL

    def commands(self, view: AgentView, record: "DecisionRecord") -> Sequence[Command[object]]:
        event = record.action.event
        return ScheduledJobEffect.commands_of(event, view.agent.agent_id) if event is not None else []

    @staticmethod
    def commands_of(event: HookEvent, agent_id: int) -> list[Command[object]]:
        tool = event.tool
        if tool is None or tool.name not in (SCHEDULE_TOOL, REMOVAL_TOOL):
            return []
        fields = event.tool_input()
        if tool.name == REMOVAL_TOOL:
            return [EndScheduledJob(agent_id, str(fields.get("id", "")))]
        matches = JOB_ID.search(str(event.raw.get("tool_response", "")))
        if matches is None:
            return []
        return [RecordScheduledJob(agent_id, matches.group(0), str(fields.get("cron", "")), str(fields.get("prompt", "")), fields.get("recurring", True) is not False)]
