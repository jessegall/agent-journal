from dataclasses import dataclass


@dataclass(frozen=True)
class PairRequest:
    """What the phone sends to pair: the code from the link or the short one typed, and the name its browser gives the device."""

    code: str = ""
    device: str = ""

    @classmethod
    def from_payload(cls, given: dict) -> "PairRequest":
        return cls(str(given.get("code", "")), str(given.get("device", "")))
