from core.base.container import Container
from core.base.periodic_checks import PeriodicChecks
from server.round_work import RoundWork


class CheckWork(RoundWork):
    """The check thread's round: each check that is due runs, so a slow check never holds up a hook."""

    def run(self, container: Container) -> None:
        container.get(PeriodicChecks).run()
