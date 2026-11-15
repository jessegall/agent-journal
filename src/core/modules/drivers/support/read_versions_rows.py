from engine.database.database import Database
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.driver_version import DriverVersion
from core.modules.drivers.models.program_version import ProgramVersion


class ReadVersionsRows:
    """The rows a step's answer basis is read from, the agent's stack and the environment's driver epoch and the program's epoch, each read once
    a request until a write changes it: the view of a step and the basis check of the save share one read."""

    def __init__(self, queries: Queries, request_values: RequestValues, database: Database) -> None:
        self.queries, self.request_values, self.database = queries, request_values, database

    def row(self, agent_id: int) -> AgentStack | None:
        return self.request_values.read(f"drivers.stack-row:{agent_id}", self.database.change_mark,
                                        lambda: self.queries.query(AgentStack).filter(session_agent_id=agent_id).first())

    def driver_version(self) -> DriverVersion | None:
        return self.request_values.read("drivers.driver-epoch", self.database.change_mark, lambda: self.queries.query(DriverVersion).first())

    def program_version(self, program: str) -> ProgramVersion | None:
        return self.request_values.read(f"drivers.program-epoch:{program}", self.database.change_mark, lambda: self.queries.query(ProgramVersion).filter(program=program).first())
