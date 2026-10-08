from controllers.types import Messages
from engine.disk import KEPT_FREE_BYTES, free_bytes, nearly_full
from features.sharing.tunnel import alerts
from features.sharing.watchdog import alert_once
from resources.base import SYSTEM

DISK_NEARLY_FULL = "disk_nearly_full"
WARN_FREE_BYTES = 2 * KEPT_FREE_BYTES


class DiskWatch:
    """Tells the owner once when free space is down to twice the kept amount, while a message can still be saved."""

    def __call__(self, shares) -> None:
        record = shares.record
        state = alerts(record.root)
        free = free_bytes(record.root)
        if free >= WARN_FREE_BYTES:
            state.set(DISK_NEARLY_FULL, 0)
            return
        alert_once(state, DISK_NEARLY_FULL, lambda: Messages(record, actor=SYSTEM).create(
            "The server's disk is nearly full", brief=f"{nearly_full(free).capitalize()}. Below {KEPT_FREE_BYTES // (1024 * 1024)} MB free the journal refuses every change, so free some space now."))
