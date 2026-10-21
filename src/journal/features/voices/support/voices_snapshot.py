from dataclasses import dataclass


@dataclass(frozen=True)
class VoicesSnapshot:
    """The voices feature's reading: how to talk to the user, from the chosen voice."""

    instruction: str
