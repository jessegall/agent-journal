from core.base.actor import Actor
from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.end_helpers_past_limits.end_helpers_past_limits import EndHelpersPastLimits
from core.modules.helpers.commands.send_helper_limit_warning.send_helper_limit_warning import SendHelperLimitWarning
from core.modules.helpers.support.helper_settings import HELPER_MAX_COST, HELPER_MAX_MINUTES
from core.modules.helpers.support.helper_spend import HelperSpend
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.usage.support.status_files import StatusFiles
from core.modules.agents.support.agent_rows import AgentRows

WARNING_SHARE = 0.8


class EndHelpersPastLimitsHandler(Handler[EndHelpersPastLimits, None]):
    """Tells a parent once at 80 percent of a limit, and past it reports the job and ends the helper's row. It reads
    the status files outside any transaction, and leaves every other type of agent alone."""

    command = EndHelpersPastLimits

    def __init__(self, queries: Queries, agents: AgentRows, jobs: HelperJobRows, settings: SettingValues, files: StatusFiles, scopes: Scopes, bus: Bus) -> None:
        self.queries, self.agents, self.jobs, self.settings, self.files, self.scopes = queries, agents, jobs, settings, files, scopes
        self.bus = bus

    def handle(self, command: EndHelpersPastLimits, context: Context) -> None:
        for helper in self.agents.running(AgentRole.HELPER):
            job = self.jobs.open_job(helper.id)
            if job is not None and helper.parent_id is not None:
                self.check(helper, job, context)

    def check(self, helper: Agent, job: HelperJob, context: Context) -> None:
        with self.scopes.opened(None, helper.environment_id):
            spend = HelperSpend(job.creation_timestamp().elapsed_seconds(context.timestamp) / 60, self.files.status(helper.session).cost_dollars,
                                self.settings.number(HELPER_MAX_MINUTES), self.settings.number(HELPER_MAX_COST))
        if spend.share >= 1:
            self.stop(helper, job, spend)
        elif spend.share >= WARNING_SHARE and not self.was_warned(helper, job):
            self.bus.run(SendHelperLimitWarning(helper.id, helper.parent_id, job.id, spend.limit_name), Actor.core(), environment_id=helper.environment_id)

    def was_warned(self, helper: Agent, job: HelperJob) -> bool:
        return self.queries.query(AgentLine).filter(session_agent_id=helper.parent_id, source=SendHelperLimitWarning.source(job.id)).exists()

    def stop(self, helper: Agent, job: HelperJob, spend: HelperSpend) -> None:
        text = f"It was stopped at its {spend.limit_name} limit."
        self.bus.run(RecordParentReport(helper.id, helper.parent_id, text, job.id), Actor.core(), environment_id=helper.environment_id)
        self.bus.run(EndAgent(helper.id), Actor.core(), environment_id=helper.environment_id)
