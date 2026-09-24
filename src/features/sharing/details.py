from features.base import FeatureDetails
from features.settings import Setting


class SharingDetails(FeatureDetails):
    name = "sharing"
    when = "the user wants to show a document, a report or a collection to someone outside the journal"

    title = "Sharing"

    abstract = """
        Share a document, a report or a collection with someone outside the journal through a tunler link that
        opens that item and nothing else
    """

    help = """
        journal share create doc:12 makes a link that opens document 12, read-only, and nothing else
        in the journal; a collection opens with every item in it. --expires 12h, 7d (the default) or
        never sets when it ends, and --password <word> asks visitors for it. journal share opens
        doc:12 says what the link would open before you make it, and journal share stop <n> ends one
        at once. A link you make stays closed until the user accepts it on the card it puts in the
        chat, so share only when the user asks.
    """

    settings = [
        Setting(
            name="host",
            default="tunler.jessegall.nl",
            title="Tunler server",
            abstract="The tunler server shares go out through; the same one tunler login uses on this machine",
        ),
    ]
