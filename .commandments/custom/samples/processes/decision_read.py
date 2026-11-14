from engine.driver.driver_rule import DriverRule
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery


class StoredDecisionRule(DriverRule):
    name = "samples.decision_read"

    def __init__(self, decisions: ReadingDecisionQuery) -> None:
        self.decisions = decisions

    def answer(self, hook):
        # @righteous architecture_processes_reading_judged_outside_the_decider
        return self.decisions.command_key_decisions(hook.name).first()
