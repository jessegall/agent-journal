from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.support.driver_settings import DRIVER_SETTINGS, SUITE_SETTING
from engine.driver.message_sender import MessageSender
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.settings.models.setting import Setting
from engine.event.changed import Changed
from engine.command.context import Context
from core.modules.agents.support.agent_rows import AgentRows


class NewDriverLinesListener(SaveListener[Changed[Setting]]):
    """When an environment's suite or one of its drivers changes, each of its open agents gets its driver's
    opening lines as lines waiting for its next hook."""

    name = "drivers.new-driver-lines"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, message_sender: MessageSender, choice: SuiteChoice) -> None:
        self.agents, self.message_sender, self.choice = agents, message_sender, choice

    def handle(self, event: Changed[Setting], context: Context) -> None:
        setting = event.row
        if setting.environment_id is None or not (setting.key == SUITE_SETTING or setting.key.startswith(DRIVER_SETTINGS)):
            return
        for agent in self.agents.running():
            driver = self.choice.driver(agent.role)
            for line in driver.instructions if driver is not None else ():
                self.message_sender.send_text(agent.id, line, self.name, context)
