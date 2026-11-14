from core.modules.docking.migrations.m002_docks_of_existing_environments import ExistingEnvironmentDocksMigration
from engine.database.statement import Statement


def test_the_migration_makes_the_dock_of_every_environment_that_has_none(journal):
    journal.run("environment make elsewhere /work/elsewhere")
    journal.database.update(Statement("DELETE FROM docks"))
    for sql in ExistingEnvironmentDocksMigration.statements:
        journal.database.update(Statement(sql))
    assert journal.database.rows(Statement("SELECT count(*) AS total FROM docks"))[0]["total"] == 2
