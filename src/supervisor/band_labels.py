from dataclasses import dataclass

WIRE_KEYS = frozenset({"left", "middle", "right"})


@dataclass(frozen=True)
class BandLabels:
    """The band's words: one on the left, one in the middle, one on the right."""

    start_label: str
    middle_label: str
    end_label: str

    @classmethod
    def parsed(cls, payload: dict) -> "BandLabels":
        return cls(str(payload["left"]), str(payload["middle"]), str(payload["right"]))

    @staticmethod
    def has_wire_keys(payload: dict) -> bool:
        return WIRE_KEYS <= payload.keys()
