from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.query.queries import Queries
from suites.coding.modules.workers.commands.prompt_idle_main_agent.prompt_idle_main_agent import PromptIdleMainAgent


class IdleMainAgentPrompt:
    """Has each environment with a running main agent wake it when it sits idle while keep going is on and work
    is left for it."""

    def __call__(self, container: Container) -> None:
        for environment_id in sorted({agent.environment_id for agent in MainAgentFinder.all_running(container.get(Queries))}):
            container.get(Bus).run(PromptIdleMainAgent(), Actor.core(), environment_id=environment_id)
