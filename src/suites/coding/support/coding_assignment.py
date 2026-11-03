from core.modules.drivers.support.suite_choice import SuiteChoice
from suites.coding.coding_suite import CodingSuite


class CodingAssignment:
    """Says whether the coding suite hands out the tasks of an environment: handing out tasks belongs to the suite
    an environment runs, so another suite brings its own way or none."""

    def __init__(self, choice: SuiteChoice) -> None:
        self.choice = choice

    def is_active(self, environment_id: int) -> bool:
        return self.choice.runs(environment_id, CodingSuite.name)
