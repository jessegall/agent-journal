from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.driver_settings import DRIVER_SETTINGS, SUITE_SETTING
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.settings.models.setting import Setting


class NewDriverLinesListener(SaveListener):
    """When an environment's suite or one of its drivers changes, each of its open agents gets its driver's
    opening lines as lines waiting for its next hook."""

    name = "drivers.new-driver-lines"
    event = "setting.*"

    def __init__(self, queries: Queries, nudger: Nudger, choice: SuiteChoice) -> None:
        self.queries, self.nudger, self.choice = queries, nudger, choice

    def handle(self, change: Change[Model]) -> None:
        setting = change.row
        if not isinstance(setting, Setting) or setting.environment_id is None or not (setting.key == SUITE_SETTING or setting.key.startswith(DRIVER_SETTINGS)):
            return
        agents = self.queries.query(Agent).filter(environment_id=setting.environment_id).matching(IsNull("ended_at")).all_rows()
        for agent in tuple(agents):
            driver = self.choice.driver(setting.environment_id, agent.role)
            for line in driver.opening_lines if driver is not None else ():
                self.nudger.send_text(agent.id, line, self.name, change.context)
