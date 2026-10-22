from dataclasses import dataclass


@dataclass(frozen=True)
class LeaseRequest:
    """The name of the lease a device takes, renews or lets go."""

    name: str
