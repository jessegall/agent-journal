from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.driver_nudges import AGENT_NOTICE
from core.modules.drivers.support.nudger import Nudger
from core.modules.plugins.commands.send_plugin_step_line.send_plugin_step_line import SendPluginStepLine

STEP_LINE_SOURCE = "plugins.step"


class SendPluginStepLineHandler(Handler[SendPluginStepLine, None]):
    """Sends the line to the agent, and to its parent when it has one."""

    command = SendPluginStepLine

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, command: SendPluginStepLine, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        self.nudger.send(agent.id, AGENT_NOTICE, STEP_LINE_SOURCE, context, text=command.text)
        if agent.parent_id is not None:
            self.nudger.send(agent.parent_id, AGENT_NOTICE, STEP_LINE_SOURCE, context, text=command.text)
