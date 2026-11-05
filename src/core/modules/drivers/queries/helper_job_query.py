from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.drivers.models.helper_job import HelperJob


class HelperJobQuery(Query[HelperJob]):
    """Reads the jobs of a helper."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, HelperJob)

    def helper_jobs(self, helper_id: int) -> list[HelperJob]:
        return list(self.filter(helper_id=helper_id).oldest().all_rows())
