from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.profiles.support.profile_files import ProfileFiles
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.base.query.conditions.is_null import IsNull
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_PASSED, MERGER_PROFILE, MERGER_SOURCE, NO_WORKER_WAITING
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport


class StartMergerHandler(Handler[StartMerger, None]):
    """Gives the merger the job: a new one, or the kept one, resumed or told. With none able to start, the main
    agent hears as it did before."""

    command = StartMerger

    def __init__(self, queries: Queries, bus: Bus, agents: AgentRows, profiles: ProfileFiles, providers: Providers) -> None:
        self.queries, self.bus, self.agents, self.profiles, self.providers = queries, bus, agents, profiles, providers

    def handle(self, command: StartMerger, context: Context) -> None:
        main_agent = self.agents.main_agent()
        try:
            if main_agent is None:
                raise Refusal("no main agent runs")
            self.give_job(Actor(main_agent.id, ActorType.AGENT), context)
        except Refusal:
            self.bus.run(SendMergerReport(command.fallback_line), context.actor, environment_id=context.environment_id)

    def give_job(self, actor: Actor, context: Context) -> None:
        kept = self.queries.query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()
        is_outdated = kept is not None and kept.ended_at is not None and not self.fits_profile(kept)
        if is_outdated:
            self.bus.run(RetireAgent(kept.id, "its profile names another provider or model"), actor, environment_id=context.environment_id)
            kept = None
        if kept is None:
            self.bus.run(StartHelper(MERGER_PROFILE, MERGER_JOB), actor, environment_id=context.environment_id)
            return
        self.bus.run(SendHelper(kept.id, MERGER_JOB, steer=kept.ended_at is None), actor, environment_id=context.environment_id)


    def fits_profile(self, kept: Agent) -> bool:
        profile = self.profiles.effective(MERGER_PROFILE)
        program = profile.program or kept.program
        return kept.program == program and kept.program_model == self.providers.provider(program).profile_model(profile)
