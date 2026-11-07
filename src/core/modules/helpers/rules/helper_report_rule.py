from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.provider.providers import Providers
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.report_nudges import REPORT_FIELD
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.drivers.support.helper_job_rows import HelperJobRows



class HelperReportRule(DriverRule):
    """What a helper says as it stops is its report to its parent; with nothing said, the parent hears that too, so
    no parent waits on a helper that left no word."""

    name = "helpers.report"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.HELPER]
    overlay_proof = True

    def __init__(self, agents: AgentRows, jobs: HelperJobRows, providers: Providers, folders: AgentFolders, profiles: ProfileFiles) -> None:
        self.agents, self.jobs, self.providers, self.folders, self.profiles = agents, jobs, providers, folders, profiles

    def answer(self, hook: AgentHook) -> RuleAnswer:
        helper = self.agents.find(hook.agent_id)
        job = self.jobs.open_job(helper.id)
        if helper.parent_id is None or job is None:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordParentReport(helper.id, helper.parent_id, self.report(hook, helper), job.id, self.reports_to_parent(helper)))

    def reports_to_parent(self, helper: Agent) -> bool:
        profile = self.profiles.registered(helper.profile)
        return profile is None or profile.reports_to_parent

    def report(self, hook: AgentHook, helper: Agent) -> str:
        stop_text = f"{hook.event.raw.get(REPORT_FIELD, '')}".strip()
        return stop_text or self.providers.provider(hook.event.program).last_reply(self.folders.folder(helper), helper.session)
