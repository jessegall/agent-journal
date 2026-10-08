from features.base import FeatureDetails
from features.groups import Group
from resources.base import PROJECT


class MembersDetails(FeatureDetails):
    explains = "The owner of a journal on a server can invite other people to log in to it."
    name = "members"
    group = Group.PROJECT
    scope = PROJECT
    label = "Let other people log in"
    hint = "Invite people to this journal on its server"
    has_skill = False
    default = False

    title = "Members"

    abstract = "People the owner invites log in to this journal on its server with a name and a password of their own"

    help = """
        Works with Run on a server. The owner invites a person by name from the People button in the top
        bar and sends them the link it makes. The link works once, for seven days: the person opens it,
        chooses a password and is logged in. After that they log in at the same address with their name
        and password.

        Members never reach the owner's password, the server's settings or the inviting of other people.
        Their passwords and logins are kept with the owner's, in files only the server's user can read.
    """
