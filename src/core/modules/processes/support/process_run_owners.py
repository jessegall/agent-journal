from core.base.run_owners import RunOwners
from core.modules.processes.queries.process_query import ProcessQuery


class ProcessRunOwners(RunOwners):
    """Finds the run a line names among the runs of the agent's own session."""

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def owns(self, agent_id: int, process_id: int) -> bool:
        return bool(self.processes.agent(agent_id).filter(id=process_id).all_rows())
