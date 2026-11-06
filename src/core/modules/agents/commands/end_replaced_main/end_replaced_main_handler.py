from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.base.tasks.clear_delegated_tasks import ClearDelegatedTasks
from core.modules.agents.commands.end_replaced_main.end_replaced_main import EndReplacedMain
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice


class EndReplacedMainHandler(Handler[EndReplacedMain, Agent]):
    """Takes the agent's delegated tasks away and ends its row, doing no process work, since it runs inside a hook."""

    command = EndReplacedMain

    def __init__(self, rows: EventRows, repository: Repository, bus: Bus, suites: SuiteChoice) -> None:
        self.rows, self.repository, self.bus, self.suites = rows, repository, bus, suites

    def handle(self, command: EndReplacedMain, context: Context) -> Agent:
        agent = self.rows.required(Agent, command.row_id)
        self.bus.dispatch(ClearDelegatedTasks(agent.id), context)
        return self.repository.save_change(agent, agent.ended(context.timestamp, self.suites.agent_policy()), context)
