from dataclasses import dataclass


@dataclass(frozen=True)
class PhoneReadings:
    """What the phone app is told of itself: its name and number, when its pairing ends, the environment it shows, and the project, with its colour."""

    phone: str
    id: int
    expires: str
    environment: str
    project: str
    color: str
