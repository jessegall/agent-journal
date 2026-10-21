from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.features.migration.support.migration_conduct import MigrationConduct
from journal.features.migration.support.migration_data_reader import MigrationDataReader
from journal.features.migration.support.migration_data import MigrationData


class MigrationFeature(Feature[MigrationData]):
    name = "migration"
    title = "Migration from version 3"
    fixed = True
    help = "A version 3 journal the installer kept in .journal/version-3 is offered to the user to bring across; the agent is told it is there and never starts it."

    PENDING_MIGRATION = Nudge(name, "version_3_not_brought_across", "a version 3 journal is kept whole in .journal/version-3, not yet brought across", "the user brings it across from the viewer; never start it yourself", repeat_interval=0)
    nudges = (PENDING_MIGRATION,)
    data = (MigrationDataReader,)
    conduct = (MigrationConduct,)

