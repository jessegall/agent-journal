from journal.events.listener import Listener
from journal.events.slow_tick import SlowTick
from journal.repositories.setting_rows import SettingRows
from journal.support.nudge_log import NudgeLog


class SlowJobNotice(Listener[SlowTick]):
    """A job's tick that ran long is told to the live agent, when the developer setting asks for it."""

    def __init__(self, settings: SettingRows, nudges: NudgeLog) -> None:
        self.settings, self.nudges = settings, nudges

    def handle(self, event: SlowTick) -> None:
        from journal.features.faults.feature import Faults
        if self.settings.option(Faults.JOBS):
            self.nudges.type(Faults.SLOW_JOB.create(job=event.job, seconds=event.seconds))
