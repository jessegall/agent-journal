from dataclasses import dataclass


@dataclass(frozen=True)
class ViewerKey:
    """A one-time login key for the viewer, and the name of the environment the person asked from, which the link
    opens; empty when the folder belongs to no environment."""

    key: str
    environment: str
