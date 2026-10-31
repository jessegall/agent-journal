from urllib.parse import urlsplit

from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.modules.phone.commands.ensure_push_keys import EnsurePushKeys
from core.modules.phone.support.push_keys import PushKeys
from core.modules.phone.support.push_service import PushService
from core.modules.phone.support.push_transport import PushTransport
from core.modules.tunnel.support.tunnels import Tunnels

SERVICES = ("web.push.apple.com", "fcm.googleapis.com", "updates.push.services.mozilla.com")
WINDOWS_SUFFIX = ".notify.windows.com"
LIFETIME_SECONDS = "3600"


class WebPush(PushService):
    """Pushes a phone as version 4 did: an empty push signed with the journal's VAPID keys, which name the
    address the tunnel gives as their contact, sent only to Apple's, Google's, Mozilla's or Microsoft's push
    service; the phone's service worker then asks what waits."""

    def __init__(self, bus: Bus, tunnels: Tunnels, clock: Clock, transport: PushTransport) -> None:
        self.bus, self.tunnels, self.clock, self.transport = bus, tunnels, clock, transport

    @staticmethod
    def is_allowed(endpoint: str) -> bool:
        parts = urlsplit(endpoint)
        host = parts.hostname or ""
        return parts.scheme == "https" and (host in SERVICES or host.endswith(WINDOWS_SUFFIX))

    def send(self, endpoint: str) -> int:
        address = self.tunnels.chosen().address()
        if not self.is_allowed(endpoint) or not address:
            return 0
        pair = self.bus.run(EnsurePushKeys(), Actor.core())
        token = PushKeys.stored(pair.secret).token(endpoint, f"https://{address}", self.clock.timestamp().value.timestamp())
        headers = {"Authorization": f"vapid t={token}, k={pair.public}", "TTL": LIFETIME_SECONDS, "Urgency": "high", "Content-Length": "0"}
        return self.transport.post(endpoint, headers)
