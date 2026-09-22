from features.base import FeatureDetails


class CollectionsDetails(FeatureDetails):
    name = "collections"
    when = "rows that belong together should be grouped into a collection"

    title = "Collections"

    aliases = ("groups",)

    abstract = "Any resources that belong together are kept in a named collection, shown as cards"

    help = """
        A collection is a row of its own whose links are its members. journal collection create "<name>"
        makes one, journal collection add <n> <ref> [<ref> ...] puts rows of any type in it,
        journal collection remove <n> <ref> takes one out and journal collection members <n> lists them.
        A row can sit in several collections; a member that is deleted is left out of the list.
    """
