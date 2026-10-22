from dataclasses import dataclass


@dataclass(frozen=True)
class LoginRequest:
    """A login as a machine sends it: the person's email and password, and a name for the machine."""

    email: str
    password: str
    device_name: str
