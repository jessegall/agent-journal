from dataclasses import dataclass


@dataclass(frozen=True)
class ManifestDashboard:
    """The dashboard a plugin declares: the name of the file it writes in its data folder, its title, and the keys
    of the events that make the viewer read it again."""

    name: str
    title: str
    event_keys: tuple[str, ...] = ()
