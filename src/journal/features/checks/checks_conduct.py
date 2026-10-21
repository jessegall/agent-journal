from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.check_completed import CheckCompleted
from journal.features.checks.support.check_output import CheckOutput


class ChecksConduct(Conduct):
    """The checks feature's conduct in every state: a check that failed is told with the end of what it printed, as still failing when it was failing before; one a task waits on is left to the wait."""

    def on_check_completed(self, event: CheckCompleted, settings: Settings) -> Transition:
        from journal.features.checks.feature import Checks
        if event.passed or event.wait_target:
            return self.none()
        failure = Checks.CHECK_FAILURE_REPEAT if event.prior_failure else Checks.CHECK_FAILED
        return self.none(failure.create(n=event.check_id, title=event.title, tail=CheckOutput.summary(event.output)))
