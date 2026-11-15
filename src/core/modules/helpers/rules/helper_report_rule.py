from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.support.helper_report_text import HelperReportText



class HelperReportRule(DriverRule):
    """What a read-only helper says as it stops is its report to its parent; with nothing said, the parent hears that
    too, so no parent waits on a helper that left no word."""

    name = "helpers.report"
    hook = HookEventName.STOP
    drivers = ["*"]
    role_group = RoleGroup.HELPERS
    overlay_proof = True

    def __init__(self, agents: AgentRows, jobs: HelperJobRows, report_text: HelperReportText) -> None:
        self.agents, self.jobs, self.report_text = agents, jobs, report_text

    def answer(self, hook: AgentHook) -> RuleAnswer:
        helper = self.agents.find(hook.agent_id)
        job = self.jobs.open_job(helper.id)
        if helper.parent_id is None or job is None:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordParentReport(helper.id, helper.parent_id, self.report_text.text(hook.event, helper), job.id))

