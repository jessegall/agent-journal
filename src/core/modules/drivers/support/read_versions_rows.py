from engine.database.database import Database
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.driver_version import DriverVersion
from core.modules.drivers.models.program_version import ProgramVersion


class ReadVersionsRows:
    """The rows a step's answer basis is read from, the agent's stack and the environment's driver version and
    the program's version, each read once a request until a write changes it: the view of a step and the basis
    check of the save share one read. A stack row is large, so after a write only its version is read again,
    and the row read before is kept while that version holds; a row saved in the write still open needs no
    check, as no other writer can change it; a rollback can give a version back, so it drops them."""

    def __init__(self, queries: Queries, request_values: RequestValues, database: Database) -> None:
        self.queries, self.request_values, self.database = queries, request_values, database
        self.stack_rows: dict[int, tuple[int, int, AgentStack]] = {}

    def row(self, agent_id: int) -> AgentStack | None:
        return self.request_values.read(f"drivers.stack-row:{agent_id}", self.database.change_mark, lambda: self.current_stack(agent_id))

    def current_stack(self, agent_id: int) -> AgentStack | None:
        stacks = self.queries.query(AgentStack).filter(session_agent_id=agent_id)
        kept = self.stack_rows.get(agent_id)
        if kept is not None and kept[0] == self.database.write_rollback_count:
            transaction_number, cached_stack = kept[1], kept[2]
            if (transaction_number and transaction_number == self.database.open_write_number) or stacks.pluck("version", int) == [cached_stack.version]:
                return cached_stack
        stack_row = stacks.first()
        if stack_row is not None:
            self.stack_rows[agent_id] = (self.database.write_rollback_count, 0, stack_row)
        return stack_row

    def remember(self, row: AgentStack) -> None:
        self.stack_rows[row.session_agent_id] = (self.database.write_rollback_count, self.database.open_write_number, row)

    def driver_version(self) -> DriverVersion | None:
        return self.request_values.read("drivers.driver-version", self.database.change_mark, lambda: self.queries.query(DriverVersion).first())

    def program_version(self, program: str) -> ProgramVersion | None:
        return self.request_values.read(f"drivers.program-version:{program}", self.database.change_mark, lambda: self.queries.query(ProgramVersion).filter(program=program).first())
