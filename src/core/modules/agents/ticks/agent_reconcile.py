from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.agents.commands.check_agent_programs.check_agent_programs import CheckAgentPrograms
from core.modules.agents.support.agent_dispatcher import AgentDispatcher


class AgentReconcile:
    """Has each environment that has an agent row to look at run one round of the dispatcher's corrections: a
    row that ended a short while ago, or a started program whose row is open."""

    def __call__(self, container: Container) -> None:
        for environment_id in container.get(AgentDispatcher).checked_environment_ids():
            container.get(Bus).run(CheckAgentPrograms(), Actor.core(), environment_id=environment_id)
