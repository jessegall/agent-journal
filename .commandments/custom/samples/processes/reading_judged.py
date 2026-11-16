from engine.agent_machine.contracts.policy import Policy


class ReaderJudge:
    def misses(self, reader: str, category: str, text: str) -> bool:
        return reader not in text


class MissedLinesPolicy(Policy):
    key = "samples.reading_judged"

    def __init__(self, judge: ReaderJudge) -> None:
        self.judge = judge

    def refusals(self, question, view):
        # @sin architecture_processes_reading_judged_outside_the_decider
        return self.judge.misses(question.reader, question.category, question.text)
