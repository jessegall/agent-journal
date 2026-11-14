from dataclasses import dataclass


@dataclass(frozen=True)
class ProfileModel:
    """A profile's helper on a program with a model: what the limits check and what an idle helper must match; an
    empty program or model matches any."""

    program: str
    model: str
    profile: str
