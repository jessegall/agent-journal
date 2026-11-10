from engine.actor.actor import Actor
from engine.enums.helper_role import HelperRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.end_helpers_past_limits.end_helpers_past_limits import EndHelpersPastLimits
from core.modules.helpers.commands.send_helper_limit_warning.send_helper_limit_warning import SendHelperLimitWarning
from core.modules.helpers.support.agent_options import AgentOptions
from core.modules.helpers.support.helper_settings import HELPER_MAX_COST, HELPER_MAX_MINUTES
from core.modules.helpers.support.helper_spend import HelperSpend
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.usage.support.status_files import StatusFiles
from core.modules.agents.support.agent_rows import AgentRows

WARNING_SHARE = 0.8


class EndHelpersPastLimitsHandler(Handler[EndHelpersPastLimits, None]):
    """Tells a parent once at 80 percent of a limit, and past it reports the job and ends the helper's row. It reads
    the status files outside any transaction, and leaves every other type of agent alone. A helper stopped at its
    program's usage limit is left alone, and the time it was stopped does not count toward its job's minutes."""

    command = EndHelpersPastLimits

    def __init__(self, queries: Queries, agents: AgentRows, jobs: HelperJobRows, settings: SettingValues, files: StatusFiles, scopes: Scopes, bus: Bus, options: AgentOptions) -> None:
        self.queries, self.agents, self.jobs, self.settings, self.files, self.scopes = queries, agents, jobs, settings, files, scopes
        self.bus, self.options = bus, options

    def handle(self, command: EndHelpersPastLimits, context: Context) -> None:
        for helper in self.agents.running(HelperRole.HELPER):
            job = self.jobs.open_job(helper.id)
            if job is not None and helper.parent_id is not None and helper.halted_at is None:
                self.check(helper, helper.parent_id, job, context)

    def check(self, helper: Agent, parent_id: int, job: HelperJob, context: Context) -> None:
        with self.scopes.opened(None, helper.environment_id):
            limits = self.options.resolved(helper.role, helper.profile).options
            max_minutes = limits.max_minutes if limits.max_minutes is not None else self.settings.number(HELPER_MAX_MINUTES)
            max_cost = limits.max_cost if limits.max_cost is not None else self.settings.decimal(HELPER_MAX_COST)
            spend = HelperSpend((job.creation_timestamp().elapsed_seconds(context.timestamp) - job.halted_seconds) / 60, self.files.status(helper.session).cost_dollars, job.cost_baseline,
                                max_minutes, max_cost)
        if spend.share >= 1:
            self.stop(helper, parent_id, job, spend)
        elif spend.share >= WARNING_SHARE and not self.is_warned(parent_id, job):
            self.bus.run(SendHelperLimitWarning(helper.id, parent_id, job.id, spend.limit_name), Actor.core(), environment_id=helper.environment_id)

    def is_warned(self, parent_id: int, job: HelperJob) -> bool:
        return self.queries.query(AgentLine).filter(session_agent_id=parent_id, source=SendHelperLimitWarning.source(job.id)).exists()

    def stop(self, helper: Agent, parent_id: int, job: HelperJob, spend: HelperSpend) -> None:
        text = f"It was stopped at its {spend.limit_name} limit."
        self.bus.run(RecordParentReport(helper.id, parent_id, text, job.id), Actor.core(), environment_id=helper.environment_id)
        self.bus.run(EndAgent(helper.id), Actor.core(), environment_id=helper.environment_id)
