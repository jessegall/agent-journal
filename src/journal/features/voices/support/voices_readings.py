from dataclasses import dataclass


@dataclass(frozen=True)
class VoicesReadings:
    """The voices feature's reading: how to talk to the user, from the chosen voice."""

    instruction: str
