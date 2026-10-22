import json
from urllib.error import URLError
from urllib.request import urlopen

from journal.config import Config

QUERY_TIMEOUT_SECONDS = 1.0


class InstanceGuard:
    """Whether another journal of this project answers already on the port its file names: a second launch then stands by instead of serving beside it, since two servers would split the hooks and the typed lines between them, and the one that stopped would take the port file with it."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def other_address(self) -> str:
        for port in self.config.stored_port():
            address = f"http://127.0.0.1:{port}"
            try:
                with urlopen(f"{address}/journal/identity", timeout=QUERY_TIMEOUT_SECONDS) as answer:
                    identity = json.loads(answer.read())
            except (OSError, URLError, ValueError):
                return ""
            if identity.get("root") == str(self.config.home):
                return address
        return ""
