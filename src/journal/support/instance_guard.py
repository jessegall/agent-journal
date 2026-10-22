import json
import os
import signal
from urllib.error import URLError
from urllib.request import urlopen

from journal.config import Config
from journal.version import VERSION

QUERY_TIMEOUT_SECONDS = 1.0


class InstanceGuard:
    """Whether another journal of this project answers already on the port its file names: a second launch of the installed version then stands by instead of serving beside it, since two servers would split the hooks and the typed lines between them, and the one that stopped would take the port file with it. One running other code than is installed, left over from before an update, is stopped, so the installed code takes its port."""

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
            if identity.get("root") != str(self.config.home):
                return ""
            if identity.get("version") != VERSION and identity.get("pid"):
                print(f"the journal at {address} runs {identity.get('version')}, not the installed {VERSION}: it is stopped", flush=True)
                self.stop(int(identity["pid"]))
            return address
        return ""

    def stop(self, pid: int) -> None:
        os.kill(pid, signal.SIGTERM)
