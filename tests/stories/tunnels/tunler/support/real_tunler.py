from core.base.journal_home import JournalHome
from tunnels.tunler.support.tunler_client import TunlerClient


def real_client(home: JournalHome) -> TunlerClient:
    """The tunler client that runs the program found on the path, for a story that puts a stand-in program there."""
    return TunlerClient(home)
