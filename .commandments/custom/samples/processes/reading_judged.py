from engine.driver.driver_rule import DriverRule


class ReaderJudge:
    def misses(self, reader: str, category: str, text: str) -> bool:
        return reader not in text


class MissedLinesRule(DriverRule):
    name = "samples.reading_judged"

    def __init__(self, judge: ReaderJudge) -> None:
        self.judge = judge

    def answer(self, hook):
        # @sin architecture_processes_reading_judged_outside_the_decider
        return self.judge.misses(hook.reader, hook.category, hook.text)
