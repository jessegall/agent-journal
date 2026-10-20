import time
import urllib.error
import urllib.request
from urllib.parse import urlsplit

from journal.config import Config
from journal.features.phone.support.push_keys import PushKeys
from journal.features.sharing.support.tunnel import Tunnel
from journal.support.private_folder import PrivateFolder

SERVICES = ("web.push.apple.com", "fcm.googleapis.com", "updates.push.services.mozilla.com")
WINDOWS = ".notify.windows.com"
SEND_SECONDS = 10


class WebPush:
    """Pushes the paired phone, as version 3 did: an empty push signed with the journal's VAPID keys, sent only to Apple's, Google's, Mozilla's or Microsoft's push service; the phone's service worker then asks what waits."""

    def __init__(self, config: Config, tunnel: Tunnel) -> None:
        self.config, self.tunnel = config, tunnel

    def keys(self) -> PushKeys:
        return PushKeys.kept(PrivateFolder(self.config.root).phone_push_file())

    @staticmethod
    def is_allowed(endpoint: str) -> bool:
        parts = urlsplit(endpoint)
        host = parts.hostname or ""
        return parts.scheme == "https" and (host in SERVICES or host.endswith(WINDOWS))

    def send(self, endpoint: str) -> int:
        """The push service's status for an empty push, or zero when none was sent: an address not allowed, no tunnel address to sign for, or no answer."""
        address = self.tunnel.address()
        if not self.is_allowed(endpoint) or not address:
            return 0
        keys = self.keys()
        token = keys.token(endpoint, f"https://{address}", time.time())
        headers = {"Authorization": f"vapid t={token}, k={PushKeys.unpadded(keys.public)}", "TTL": "3600", "Urgency": "high", "Content-Length": "0"}
        try:
            with urllib.request.urlopen(urllib.request.Request(endpoint, data=b"", headers=headers, method="POST"), timeout=SEND_SECONDS) as answer:
                return answer.status
        except urllib.error.HTTPError as refused:
            return refused.code
        except (urllib.error.URLError, OSError):
            return 0
