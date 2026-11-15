from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from suites.coding.models.enums.ask_topic import AskTopic


class WorkerFullTestRunNudge(NudgeDeclaration):
    """The nudge coding.worker_full_test_run."""

    key = "coding.worker_full_test_run"
    type = NudgeType.REFUSAL
    text = 'a worker runs only the tests of what it changed, never the whole suite: name the test files. ' + AskTopic.TOOL.question_line()
    turn_limited = False
    full_text = True
