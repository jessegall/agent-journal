from xdist.scheduler.worksteal import WorkStealingScheduling

UNIT_FOLDER = "tests/unit/"


class UnitRunnerScheduling(WorkStealingScheduling):
    """Work stealing with every unit test handed to the first runner at the start: holding them, that runner is
    never idle, so the stories go to the others, and a runner that runs dry steals as before. xdist's own
    loadgroup would place the unit tests on one runner too, but it gives up work stealing for every test."""

    def schedule(self) -> None:
        if self.collection is not None or not self.nodes or not self.node2collection:
            super().schedule()
            return
        collection = next(iter(self.node2collection.values()))
        if any(second != collection for second in self.node2collection.values()):
            super().schedule()
            return
        self.collection = collection
        units = [index for index, test in enumerate(collection) if test.startswith(UNIT_FOLDER)]
        unit_set = set(units)
        self.pending[:] = [index for index in range(len(collection)) if index not in unit_set]
        if units:
            first = self.nodes[0]
            self.node2pending[first].extend(units)
            first.send_runtest_some(units)
        if collection:
            self.check_schedule()
