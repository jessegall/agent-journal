from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.provider.providers import Providers
from core.modules.agents.commands.set_agent_usage_limit.set_agent_usage_limit import SetAgentUsageLimit
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.type_waiting_lines.type_waiting_lines import TypeWaitingLines
from engine.time.clock import Clock
from core.modules.helpers.commands.refresh_hourly_limits.refresh_hourly_limits import RefreshHourlyLimits
from core.modules.helpers.commands.end_agent_lockdown.end_agent_lockdown import EndAgentLockdown
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.usage_limits import UsageLimits


class UsageLimitMarker:
    """Every few seconds, marks the open agents of each program whose plan allowance is used up in full as at
    the usage limit until it starts again, or until the limit a person set is lifted, and, once it has
    started again, clears the mark, tells each agent a hook of which was stopped to go on, and types the lines
    that waited."""

    def __call__(self, container: Container) -> None:
        states, bus, agents = container.get(ProgramStates), container.get(Bus), container.get(AgentRows).running()
        for program in container.get(Providers).all():
            if container.get(UsageLimits).stale_hourly(program.name, states.windows(program.name), container.get(Clock).timestamp()):
                bus.run(RefreshHourlyLimits(program.name), Actor.core())
            resets_at = states.limit_reset_timestamp(program.name)
            for agent in (agent for agent in agents if agent.program == program.name and (agent.usage_limit_ends_at != resets_at or (resets_at is None and agent.halted_at is not None))):
                bus.run(SetAgentUsageLimit(agent.id, resets_at), Actor.core(), environment_id=agent.environment_id)
                if resets_at is None:
                    bus.run(EndAgentLockdown(agent.id), Actor.core(), environment_id=agent.environment_id)
                    bus.run(TypeWaitingLines(agent.id), Actor.core(), environment_id=agent.environment_id)
