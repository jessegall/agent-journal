from engine.driver.nudge_declaration import NudgeDeclaration
from suites.coding.models.enums.ask_topic import AskTopic
from engine.enums.nudge_type import NudgeType


class WorkerTestLineRefusedNudge(NudgeDeclaration):
    """The nudge workers.named_tests_only."""

    key = "workers.named_tests_only"
    type = NudgeType.SAFETY_REFUSAL
    text = "A test runs only through your test commands. Yours: {names}. " + AskTopic.TESTS.question_line()
    turn_limited = False
    full_text = True
