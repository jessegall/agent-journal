from journal.features.bus import Bus


class Feature:
    """One switchable behaviour: it registers its listeners and nothing else."""

    name: str

    def register(self, bus: Bus) -> None: ...
