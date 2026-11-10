from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.base.driver.nudge import Nudge
from core.base.provider.providers import Providers
from engine.query.queries import Queries
from core.modules.profiles.support.profile_files import ProfileFiles
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.minimum import Minimum
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_PROFILE, MERGER_SOURCE
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from core.modules.helpers.support.profile_models import ProfileModels


class StartMergerHandler(Handler[StartMerger, None]):
    """Gives the merger the job: a new one, or the kept one, resumed or told. A kept merger its profile no longer
    fits is retired and replaced, since it could never start again. With none able to start, the main agent
    hears as it did before."""

    command = StartMerger
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, bus: Bus, agents: AgentRows, profiles: ProfileFiles, providers: Providers, main_line: MainAgentLine, models: ProfileModels) -> None:
        self.queries, self.bus, self.agents, self.profiles, self.providers = queries, bus, agents, profiles, providers
        self.main_line, self.models = main_line, models

    def handle(self, command: StartMerger, context: Context) -> None:
        main_agent = self.agents.main_agent()
        try:
            if main_agent is None:
                raise Refusal("no main agent runs")
            self.assign_job(Actor(main_agent.id, ActorType.AGENT), context)
        except Exception as failure:
            fallback = command.fallback_line.text if isinstance(command.fallback_line, Nudge) else command.fallback_line
            reason = failure.reason if isinstance(failure, Refusal) else f"an unexpected fault, {type(failure).__name__}: {failure}"
            text = f"{fallback} (the merger did not start: {reason})"
            existing = self.queries.query(AgentLine).filter(source=MERGER_SOURCE, state=AgentLineState.WAITING, text=text).first()
            if existing is not None or self.is_repeat(command, text):
                return
            self.main_line.send(text, MERGER_SOURCE, context)

    def is_repeat(self, command: StartMerger, text: str) -> bool:
        if command.started_at is None:
            return False
        return self.queries.query(AgentLine).filter(source=MERGER_SOURCE, text=text).matching(Minimum("created_at", command.started_at.text)).first() is not None

    def assign_job(self, actor: Actor, context: Context) -> None:
        kept = self.queries.query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()
        if kept is not None and kept.ended_at is not None and not self.fits_profile(kept):
            self.bus.run(RetireAgent(kept.id, f"runs {kept.program} {kept.program_model}, which its profile no longer lists"), actor, environment_id=context.environment_id)
            kept = None
        if kept is None:
            self.bus.run(StartHelper(MERGER_PROFILE, MERGER_JOB), actor, environment_id=context.environment_id)
            return
        self.bus.run(SendHelper(kept.id, MERGER_JOB, steer=kept.ended_at is None), actor, environment_id=context.environment_id)


    def fits_profile(self, kept: Agent) -> bool:
        profile = self.profiles.effective(MERGER_PROFILE)
        program = profile.program or kept.program
        return kept.program == program and kept.program_model == self.models.model(profile, self.providers.provider(program), None, "helper")
