from features.base import FeatureDetails
from features.groups import Group
from features.settings import Setting
from resources.base import PROJECT


class HostedJournalDetails(FeatureDetails):
    explains = "The journal can run on a server of your own. You log in at its address with a password and work in the full viewer there."
    name = "hosted_journal"
    group = Group.PROJECT
    scope = PROJECT
    label = "Run on a server"
    hint = "Log in to this journal at its own address"
    has_skill = False
    default = False

    title = "Journal on a server"

    abstract = "This journal runs on a server, and you log in at its address with one password to use the viewer and pair your phone"

    help = """
        Switch it on only on the server: the Docker image does this for you. The journal itself stays
        on the server's own machine, and a login page at the server's address is the only way in. One
        password, the owner's, opens the full viewer; the phone pairs at the same address.

        Five wrong passwords from one place lock that place out for fifteen minutes, kept across
        restarts. A login lasts the number of days set here. The server never runs the journal's run,
        upgrade, stop or hook addresses for anyone who comes in from outside: the Docker image is
        upgraded by Watchtower instead.

        The password, logins, wrong tries and the log of who logged in are kept in files only the
        server's user can read, outside the journal's own folder.
    """

    settings = [
        Setting("address", "", "The address this journal answers at", "The server's own domain, such as journal.example.com"),
        Setting("listen", "127.0.0.1", "Where the login page listens", "127.0.0.1 keeps it on the server; the Docker image sets 0.0.0.0 so the TLS proxy beside it can reach it"),
        Setting("port", 8440, "The login page's port", "The TLS proxy forwards the server's address to this port"),
        Setting("days", 7, "How long a login lasts", unit="days"),
        Setting("agents", 3, "Agents running at once", "Starting one more is refused until one stops; each agent uses the server's memory and your provider's spend"),
    ]
