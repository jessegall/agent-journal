from dataclasses import replace

from core.base.actor import Actor
from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.scope.scopes import Scopes
from core.modules.agents.commands.end_replaced_main.end_replaced_main import EndReplacedMain
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class SingleMainAgent:
    """Keeps one main agent to an environment: an agent that opens as main ends every other that runs there."""

    def __init__(self, agents: AgentRows, scopes: Scopes, bus: Bus) -> None:
        self.agents, self.scopes, self.bus = agents, scopes, bus

    def end(self, opened: Agent, context: Context) -> None:
        if opened.role != AgentRole.MAIN:
            return
        with self.scopes.opened(None, opened.environment_id):
            replaced_mains = [main for main in self.agents.running_main_agents() if main.id != opened.id]
        for main in replaced_mains:
            self.bus.dispatch(EndReplacedMain(main.id), replace(context, actor=Actor.core(), environment_id=opened.environment_id))
