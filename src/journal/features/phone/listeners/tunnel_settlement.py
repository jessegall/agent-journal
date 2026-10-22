from datetime import datetime, timezone

from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.features.sharing.support.tunnel import Tunnel


class TunnelSettlement(Listener[ClockTicked]):
    """As the clock ticks, the tunnel is settled again when what keeps it open has changed, so it closes once a pairing code or a phone's days run out."""

    def __init__(self, tunnel: Tunnel) -> None:
        self.tunnel = tunnel

    def handle(self, event: ClockTicked) -> None:
        self.tunnel.reconcile_changes(datetime.now(timezone.utc))
