from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.features.migration.support.migration_conduct import MigrationConduct
from journal.features.migration.support.migration_data_reader import MigrationDataReader


class MigrationFeature(Feature):
    name = "migration"
    title = "Migration from version 3"
    fixed = True
    help = "A version 3 journal the installer kept in .journal/version-3 is offered to the user to bring across; the agent is told it is there and never starts it."

    VERSION_3_NOT_BROUGHT_ACROSS = Nudge(name, "version_3_not_brought_across", "a version 3 journal is kept whole in .journal/version-3, not yet brought across", "the user brings it across from the viewer; never start it yourself", repeat_after=0)
    nudges = (VERSION_3_NOT_BROUGHT_ACROSS,)
    data = (MigrationDataReader,)
    conduct = (MigrationConduct,)

