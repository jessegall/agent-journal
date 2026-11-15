from engine.database.database import Database
from engine.request.request_values import RequestValues
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery


class RunOutputRows:
    """A run's output row, read once a request until a write changes it: the conditions of the holds on one run share
    one read."""

    def __init__(self, outputs: OutputQuery, request_values: RequestValues, database: Database) -> None:
        self.outputs, self.request_values, self.database = outputs, request_values, database

    def of_run(self, process_id: int) -> Output | None:
        return self.request_values.read(f"processes.run-output:{process_id}", self.database.change_mark, lambda: self.outputs.process(process_id).first())
