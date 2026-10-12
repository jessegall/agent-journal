from declaring.details import FeatureDetails
from declaring.groups import Group


class KeptRowsDetails(FeatureDetails):
    explains = "The journal keeps what it has read in memory across an update, so the first requests after it are as fast as the last ones before it."
    name = "kept_rows"
    group = Group.PROJECT
    label = "Keep what it has read when it restarts for an update"
    hint = "A release can ask for a full restart, and anything that can no longer be read is read again from the disk."
    has_skill = False

    title = "Rows kept across an update"

    abstract = """
        When the server stops for an update it writes the rows it holds in memory to a file, and the next
        server reads them back. A row whose file changed meanwhile is read again, and so is every row of a
        type whose version changed.
    """

    help = """
        Each kind of row carries a version, which changes when the way its rows are read changes. Rows
        of a kind with a new version are dropped and read again from their files, the others stay. A
        release that needs everything read again says so in its changelog entry with the line
        <!-- full-restart -->, and the rows kept from before it are dropped. A kept row that cannot
        be read back is dropped and read again from its file.
    """
