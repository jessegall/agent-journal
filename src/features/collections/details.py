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
        and they sit in no collection, make one: journal collection create "<the subject>", add them all, and
        say so in one line so the user can rename or remove it. A single row with nothing related gets no
        collection of its own, and a row the user took out of a collection is never put back.
    """
