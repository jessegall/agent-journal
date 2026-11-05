from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.driver_settings import DRIVER_SETTINGS, SUITE_SETTING
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.settings.models.setting import Setting
from core.base.change.changed import Changed
from core.base.command.context import Context


class NewDriverLinesListener(SaveListener[Changed[Setting]]):
    """When an environment's suite or one of its drivers changes, each of its open agents gets its driver's
    opening lines as lines waiting for its next hook."""

    name = "drivers.new-driver-lines"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger, choice: SuiteChoice) -> None:
        self.queries, self.nudger, self.choice = queries, nudger, choice

    def handle(self, event: Changed[Setting], context: Context) -> None:
        setting = event.row
        if setting.environment_id is None or not (setting.key == SUITE_SETTING or setting.key.startswith(DRIVER_SETTINGS)):
            return
        agents = self.queries.query(Agent).matching(IsNull("ended_at")).all_rows()
        for agent in tuple(agents):
            driver = self.choice.driver(setting.environment_id, agent.role)
            for line in driver.opening_lines if driver is not None else ():
                self.nudger.send_text(agent.id, line, self.name, context)
