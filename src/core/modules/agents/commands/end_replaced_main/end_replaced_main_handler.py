from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.agents.commands.end_replaced_main.end_replaced_main import EndReplacedMain
from core.modules.agents.models.agent import Agent
from engine.helper_type.helper_type_book import HelperTypeBook


class EndReplacedMainHandler(Handler[EndReplacedMain, Agent]):
    """Ends the row of a main session another replaces, doing no process work, since it runs inside a hook. Its
    delegated tasks stay with the agent."""

    command = EndReplacedMain

    def __init__(self, rows: EventRows, repository: Repository, bus: Bus, types: HelperTypeBook) -> None:
        self.rows, self.repository, self.bus, self.types = rows, repository, bus, types

    def handle(self, command: EndReplacedMain, context: Context) -> Agent:
        agent = self.rows.required(Agent, command.row_id)
        return self.repository.save_change(agent, agent.ended(context.timestamp, self.types.behaviours(agent.role)), context)
