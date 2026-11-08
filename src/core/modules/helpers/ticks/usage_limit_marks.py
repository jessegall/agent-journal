from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.provider.providers import Providers
from core.modules.agents.commands.set_agent_usage_limit.set_agent_usage_limit import SetAgentUsageLimit
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.type_waiting_lines.type_waiting_lines import TypeWaitingLines
from core.modules.helpers.support.program_states import ProgramStates


class UsageLimitMarks:
    """Every few seconds, marks the open agents of each program whose plan allowance is used up in full as at the usage
    limit until it starts again, and, once it has started again, clears the mark and types the lines that waited."""

    def __call__(self, container: Container) -> None:
        states, bus, agents = container.get(ProgramStates), container.get(Bus), container.get(AgentRows).running()
        for program in container.get(Providers).all():
            resets_at = states.limit_resets_at(program.name)
            for agent in (agent for agent in agents if agent.program == program.name and agent.limited_until != resets_at):
                bus.run(SetAgentUsageLimit(agent.id, resets_at), Actor.core(), environment_id=agent.environment_id)
                if resets_at is None:
                    bus.run(TypeWaitingLines(agent.id), Actor.core(), environment_id=agent.environment_id)
