from core.base.agent_role import AgentRole
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart


class WorkerRuns:
    """Tells whether a run is one of a worker's own commands, which leaves no docked card and no chat mark; its test
    runs are shown, and so is whatever the journal starts for its work, which is run for its main agent."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def hides(self, process: Process) -> bool:
        if self.queries.query(Agent).find(process.agent_id).role is not AgentRole.WORKER or process.category is CommandCategory.TEST_RUN:
            return False
        return not self.queries.query(ProcessPart).filter(process_id=process.id, category=CommandCategory.TEST_RUN).exists()
