import json

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.record_driver_tables.record_driver_tables import RecordDriverTables
from core.modules.drivers.models.driver_table import DriverTable

RECORDED_REASON = "the digests of one sync are a handful, one per driver"


class RecordDriverTablesHandler(Handler[RecordDriverTables, None]):
    """Saves a row for each compiled driver table whose driver and digest have no row yet; a digest seen before
    is never written twice."""

    command = RecordDriverTables

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordDriverTables, context: Context) -> None:
        digests = [table.digest() for table in command.tables]
        recorded = {(row.driver_name, row.digest) for row in self.queries.query(DriverTable).matching(Among("digest", digests)).every_row(RECORDED_REASON)}
        for table in command.tables:
            if (table.driver, table.digest()) not in recorded:
                self.repository.save(DriverTable(driver_name=table.driver, digest=table.digest(), compiled_at=context.timestamp,
                                                 manifest=json.dumps(table.manifest())), context)
