from features.base import FeatureDetails


class GroupsDetails(FeatureDetails):
    name = "groups"

    title = "Groups"

    abstract = "Any resources that belong together are kept in a named group, shown as cards"

    help = """
        A group is a row of its own whose links are its members. journal group create "<name>"
        makes one, journal group add <n> <ref> [<ref> ...] puts rows of any type in it,
        journal group remove <n> <ref> takes one out and journal group members <n> lists them.
        A row can sit in several groups; a member that is deleted is left out of the list.
    """
