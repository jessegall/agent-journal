from features.base import FeatureDetails
from features.groups import Group
from features.settings import Setting
from resources.base import PROJECT


class ConnectionDetails(FeatureDetails):
    explains = "Connect this journal to one running on a server, so your environments can be written there and your code reaches it through git."
    name = "connection"
    group = Group.SHARING
    label = "Connect to a journal on a server"
    has_skill = False
    default = False
    scope = PROJECT

    title = "Connection to a server"

    abstract = "This journal and one on a server, sharing environments and code"

    help = """
        Saving the server's address checks that both journals can work together: the release, the sync's own version and the
        shape of the record. A copy too old to carry the sync's checks on what never leaves a machine is refused with a
        notice. journal environment connect <address> <machine key> does the same from the terminal, with the key the server's
        hosted-journal machine-key made for this computer, which stays on this computer; journal environment hand <environment>
        server|here moves one environment between the two machines, journal environment sync sends what was written while the
        server was away and pulls what happened there, and journal environment code_push and code_pull carry the project's files
        through git, never over a file you changed here.
    """

    settings = [
        Setting(
            name="address",
            default="",
            title="The server's address",
            abstract="Where the journal on the server answers, such as https://journal.example.com",
            scope=PROJECT,
        ),
    ]
