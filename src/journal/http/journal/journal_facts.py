from dataclasses import dataclass


@dataclass(frozen=True)
class JournalFacts:
    """What the viewer boots from: the project, the environment it opens on, the version and build, and every feature with its options in the groups the settings page shows."""

    project: str
    environment: str
    version: str
    build: str
    features: list
    groups: list
