from engine.driver.driver_rule import DriverRule
from core.modules.processes.support.process_nudges import OUTPUT_ENDED


class EndedLineRule(DriverRule):
    name = "samples.ended_line"

    def answer(self, hook):
        # @righteous architecture_processes_reading_nudge_outside_the_notices
        return OUTPUT_ENDED.nudge(output=hook.output)
