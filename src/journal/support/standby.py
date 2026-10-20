import json
from urllib.error import URLError
from urllib.request import urlopen

from journal.config import Config

ASK_SECONDS = 1.0


class Standby:
    """Whether another journal of this project answers already on the port its file names: a second launch then stands by instead of serving beside it, since two servers would split the hooks and the typed lines between them, and the one that stopped would take the port file with it."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def another(self) -> str:
        """The address of the other journal of this project, or empty: a port another project holds, or a dead port, is no other journal."""
        for port in self.config.remembered_port():
            address = f"http://127.0.0.1:{port}"
            try:
                with urlopen(f"{address}/journal/identity", timeout=ASK_SECONDS) as answer:
                    identity = json.loads(answer.read())
            except (OSError, URLError, ValueError):
                return ""
            if identity.get("root") == str(self.config.home):
                return address
        return ""
