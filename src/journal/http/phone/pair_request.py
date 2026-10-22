from dataclasses import dataclass


@dataclass(frozen=True)
class PairRequest:
    """What the phone sends to pair: the code from the link or the short one typed, and the name its browser gives the device."""

    code: str = ""
    device: str = ""

    @classmethod
    def parsed(cls, value: dict) -> "PairRequest":
        return cls(str(value.get("code", "")), str(value.get("device", "")))
