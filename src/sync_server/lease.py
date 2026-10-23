from dataclasses import dataclass


@dataclass(frozen=True)
class Lease:
    """Who holds a named lease: its name, the device and the person holding it, when it was last renewed, and whether it has lapsed for want of renewal; an empty holder when nobody holds it."""

    name: str
    device_id: int = 0
    holder: str = ""
    renewed_at: float = 0.0
    is_lapsed: bool = False

    def excludes(self, device_id: int) -> bool:
        return bool(self.holder) and not self.is_lapsed and self.device_id != device_id
