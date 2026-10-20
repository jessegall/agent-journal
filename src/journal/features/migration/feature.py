from journal.engine.nudge import Nudge
from journal.support.entry import Entry
from journal.features.feature import Feature
from journal.models.node_kind import NodeKind


class MigrationFeature(Feature):
    name = "migration"
    title = "Migration from version 3"
    fixed = True
    help = "A version 3 journal the installer kept in .journal/version-3 is offered to the user to bring across; the agent is told it is there and never starts it."

    VERSION_3_NOT_BROUGHT_ACROSS = Nudge(name, "version_3_not_brought_across", "a version 3 journal is kept whole in .journal/version-3, not yet brought across", "the user brings it across from the viewer; never start it yourself", repeat_after=0)
    nudges = (VERSION_3_NOT_BROUGHT_ACROSS,)

    checks = (
        Entry(NodeKind.CHECK, 'version_3_waiting', 'Has a version 3 journal to bring across?', 'the installer kept a version 3 journal here and the user has not brought it across yet'),
    )
