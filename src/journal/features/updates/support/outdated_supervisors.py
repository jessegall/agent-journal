class OutdatedSupervisors:
    """The environments whose supervisor said at the journal's boot that its code on disk changed since it started, each kept until its restart."""

    def __init__(self) -> None:
        self._environments: set[int] = set()

    def add(self, environment_id: int) -> None:
        self._environments.add(environment_id)

    def claim(self, environment_id: int) -> bool:
        if environment_id not in self._environments:
            return False
        self._environments.remove(environment_id)
        return True
