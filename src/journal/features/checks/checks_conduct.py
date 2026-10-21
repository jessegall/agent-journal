from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.check_completed import CheckCompleted
from journal.features.checks.support.check_output import CheckOutput


class ChecksConduct(Conduct):
    """The checks feature's conduct in every state: a check that starts failing is told with the end of what it printed, and one still failing only once the set minutes have passed since it was last reported; one a task waits on is left to the wait, and nothing is told while the agent waits, stuck included."""

    def on_check_completed(self, event: CheckCompleted, settings: Settings) -> Transition:
        from journal.features.checks.feature import Checks
        if event.passed or event.wait_target or self.is_waiting():
            return self.none()
        if not event.prior_failure:
            return self.none(Checks.CHECK_FAILED.create(n=event.check_id, title=event.title, tail=CheckOutput.summary(event.output)))
        minutes = float(settings.value(Checks.REPEAT))
        if not minutes or event.time - event.failure_reported_at < minutes * 60:
            return self.none()
        return self.none(Checks.CHECK_FAILURE_REPEAT.create(n=event.check_id, title=event.title, tail=CheckOutput.summary(event.output)))
