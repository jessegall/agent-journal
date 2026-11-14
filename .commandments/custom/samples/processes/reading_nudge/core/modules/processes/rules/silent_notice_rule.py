from engine.driver.driver_rule import DriverRule
from core.modules.processes.support.process_nudges import RUN_SPARSE


class SilentNoticeRule(DriverRule):
    name = "samples.silent_notice"

    def answer(self, hook):
        # @sin architecture_processes_reading_nudge_outside_the_notices
        return RUN_SPARSE.nudge(output=hook.output, seconds=hook.seconds, hint="")
