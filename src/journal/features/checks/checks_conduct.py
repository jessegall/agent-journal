from journal.engine.conduct import Conduct
from journal.support.timeout import Timeout
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.check_completed import CheckCompleted
from journal.features.checks.support.check_output import CheckOutput
from journal.features.checks.checks_nudges import ChecksNudges
from journal.features.checks.checks_options import ChecksOptions


class ChecksConduct(Conduct):
    """The checks feature's conduct in every state: a check that could not run is reported once, apart from a failure; a check that starts failing is reported to the agent with the end of what it printed, and one still failing only once the set minutes have passed since it was last reported; one a task waits on is left to the wait, and nothing is reported while the agent waits, stuck included."""

    def on_check_completed(self, event: CheckCompleted, settings: Settings) -> Transition:
        if event.passed or event.wait_target or self.is_waiting():
            return self.none()
        if event.fault:
            return self.none() if event.prior_fault else self.none(ChecksNudges.CHECK_COULD_NOT_RUN.create(n=event.check_id, tail=CheckOutput.summary(event.output)))
        if not event.prior_failure:
            return self.none(ChecksNudges.CHECK_FAILED.create(n=event.check_id, title=event.title, tail=CheckOutput.summary(event.output)))
        minutes = settings.decimal(ChecksOptions.REPEAT)
        if not minutes or not Timeout.minutes(minutes).started(event.failure_reported_at).is_elapsed(event.time):
            return self.none()
        return self.none(ChecksNudges.CHECK_FAILURE_REPEAT.create(n=event.check_id, title=event.title, tail=CheckOutput.summary(event.output)))
