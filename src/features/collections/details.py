from features.base import FeatureDetails
from features.groups import Group


class CollectionsDetails(FeatureDetails):
    explains = 'The agent can gather related items into a named collection. You can open, rename, or rearrange the collection.'
    name = "collections"
    group = Group.RECORDS
    label = "Collections"
    when = "rows that belong together should be grouped into a collection"

    title = "Collections"

    aliases = ("groups",)

    abstract = "Any resources that belong together are kept in a named collection, shown as cards"

    help = """
        A collection is a row of its own whose links are its members. journal collection create "<name>"
        makes one, journal collection add <n> <ref> [<ref> ...] puts rows of any type in it,
        journal collection remove <n> <ref> takes one out and journal collection members <n> lists them.
        A row can sit in several collections; a member that is deleted is left out of the list.

        When you notice rows that belong together, such as documents on one subject or to-dos of one effort,
        and they sit in no collection, ask the user once with journal question ask whether to keep them in a
        collection: name it in the question and list the rows in the brief, with the options to collect them
        or leave them. On yes, create it and add them; never collect unasked, and never ask again about rows
        the user chose to leave.
    """
