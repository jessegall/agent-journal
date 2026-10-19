from datetime import datetime, timezone

from journal.events.clock_ticked import ClockTicked
from journal.features.checks.support.check_runner import CheckRunner
from journal.events.listener import Listener
from journal.support.actor import Actor
from journal.repositories.checks import Checks


class RunDueChecks(Listener[ClockTicked]):
    """Every tick, the checks whose interval has passed run."""

    def __init__(self, checks: Checks, runner: CheckRunner) -> None:
        self.checks, self.runner = checks, runner

    def handle(self, event: ClockTicked) -> None:
        for check in self.checks.due(datetime.now(timezone.utc)):
            self.runner.run(check, Actor.system())
