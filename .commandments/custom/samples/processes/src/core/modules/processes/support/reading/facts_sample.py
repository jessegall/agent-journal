from core.modules.processes.support.reader_judge import ReaderJudge


class GatheredFacts:
    def __init__(self, judge: ReaderJudge) -> None:
        self.judge = judge

    def fits(self, reader, category, text):
        # @righteous architecture_processes_reading_judged_outside_the_decider
        return not self.judge.misses(reader, category, text)
