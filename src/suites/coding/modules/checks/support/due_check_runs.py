from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.periodic_checks import PeriodicChecks
from core.base.refusal import Refusal
from suites.coding.modules.checks.commands.record_check_run.record_check_run import RecordCheckRun
from suites.coding.modules.checks.commands.support.check_progress import CheckProgress
from suites.coding.modules.checks.commands.support.check_runner import CheckRunner
from suites.coding.modules.checks.queries.check_query import CheckQuery


class DueCheckRuns(PeriodicChecks):
    """Runs each check whose interval has passed, then records its result in a short transaction of its own.
    """

    def __init__(self, checks: CheckQuery, runner: CheckRunner, bus: Bus, clock: Clock) -> None:
        self.checks, self.runner, self.bus, self.clock = checks, runner, bus, clock

    def run(self) -> None:
        for check in self.checks.due(self.clock.timestamp()):
            if check.stopped or check.removed_at is not None:
                continue
            outcome = self.runner.run(check.command, CheckProgress(self.bus, check.id).read_line)
            try:
                self.bus.run(RecordCheckRun(check.id, outcome.passed, outcome.output), Actor.core())
            except Refusal:
                continue
