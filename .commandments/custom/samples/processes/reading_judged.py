from engine.driver.driver_rule import DriverRule
from core.modules.processes.support.reader_judge import ReaderJudge


class MissedLinesRule(DriverRule):
    def __init__(self, judge: ReaderJudge) -> None:
        self.judge = judge

    def answer(self, hook):
        # @sin architecture_processes_reading_judged_outside_the_decider
        return self.judge.misses(hook.reader, hook.category, hook.text)
