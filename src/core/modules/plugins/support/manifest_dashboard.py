from dataclasses import dataclass


@dataclass(frozen=True)
class ManifestDashboard:
    """The dashboard a plugin declares: the name of the file it writes in its data folder, and its title."""

    name: str
    title: str
