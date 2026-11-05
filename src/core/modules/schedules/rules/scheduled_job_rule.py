import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job import EndScheduledJob
from core.modules.schedules.commands.record_scheduled_job.record_scheduled_job import RecordScheduledJob

SCHEDULE_TOOL = "CronCreate"
REMOVAL_TOOL = "CronDelete"
JOB_ID = re.compile(r"\b[0-9a-f]{8}\b")


class ScheduledJobRule(DriverRule):
    """Keeps each job an agent schedules, with the id its tool's answer names, and ends each it deletes."""

    name = "schedules.scheduled-job"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.name not in (SCHEDULE_TOOL, REMOVAL_TOOL):
            return RuleAnswer.allowed()
        fields = hook.event.tool_input()
        if tool.name == REMOVAL_TOOL:
            return RuleAnswer.allowed().running(EndScheduledJob(hook.agent_id, str(fields.get("id", ""))))
        matches = JOB_ID.search(str(hook.event.raw.get("tool_response", "")))
        if matches is None:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordScheduledJob(hook.agent_id, matches.group(0), str(fields.get("cron", "")), str(fields.get("prompt", "")), fields.get("recurring", True) is not False))
