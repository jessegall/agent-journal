from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.guards.driver_setting_guard import DRIVER_SETTINGS
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.settings.models.setting import Setting


class NewDriverLinesListener(SaveListener):
    """When an environment's suite or one of its drivers changes, each of its open agents gets its driver's opening
    lines as lines waiting for its next hook."""

    name = "drivers.new-driver-lines"
    event = "setting.*"

    def __init__(self, queries: Queries, repository: Repository, choice: SuiteChoice) -> None:
        self.queries, self.repository, self.choice = queries, repository, choice

    def handle(self, change: Change[Model]) -> None:
        setting = change.row
        if not isinstance(setting, Setting) or setting.environment_id is None or not setting.key.startswith(DRIVER_SETTINGS):
            return
        agents = self.queries.query(Agent).filter(environment_id=setting.environment_id).matching(IsNull("ended_at")).all_rows()
        for agent in tuple(agents):
            driver = self.choice.driver(setting.environment_id, agent.role)
            for line in driver.opening_lines if driver is not None else ():
                self.repository.save(AgentLine(agent_id=agent.id, creator_id=change.context.actor.id, text=line, source=self.name), change.context)
