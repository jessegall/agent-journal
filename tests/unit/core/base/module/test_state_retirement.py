from core.base.database.table_statements import TableStatements
from core.base.model.tables import Tables
from tests.unit.core.base.module.test_state_check import Item


def test_a_retirement_raises_the_version_so_a_save_built_on_the_old_row_is_stale():
    statement = TableStatements(Tables().table(Item)).state_retirement("hold", "open", "2026-11-05T00:00:00+00:00")
    assert "version = version + 1" in statement.sql
    assert statement.parameters == ("open", "2026-11-05T00:00:00+00:00", "hold")
