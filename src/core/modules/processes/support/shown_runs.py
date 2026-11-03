from core.base.agent_role import AgentRole
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart

FILE_CATEGORIES = (CommandCategory.SEARCH, CommandCategory.READ, CommandCategory.EDIT)


class ShownRuns:
    """Tells whether a run leaves no docked card and no chat mark: one whose commands only read, search or write
    files, for any agent, and a worker's own command that is no test run. Tests, builds and what the journal
    starts show."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def hides(self, process: Process) -> bool:
        parts = tuple(self.queries.query(ProcessPart).filter(process_id=process.id).all_rows())
        if parts and all(part.category in FILE_CATEGORIES for part in parts):
            return True
        if self.queries.query(Agent).find(process.agent_id).role is not AgentRole.WORKER or process.category is CommandCategory.TEST_RUN:
            return False
        return not any(part.category is CommandCategory.TEST_RUN for part in parts)
