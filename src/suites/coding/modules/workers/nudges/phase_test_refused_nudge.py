from engine.driver.nudge_declaration import NudgeDeclaration
from suites.coding.models.enums.ask_topic import AskTopic
from engine.enums.nudge_type import NudgeType


class PhaseTestRefusedNudge(NudgeDeclaration):
    """The nudge workers.phase_test_refused."""

    key = "workers.phase_test_refused"
    type = NudgeType.SAFETY_REFUSAL
    text = 'No test runs left before your next commit: commit and go on. ' + AskTopic.TESTS.question_line()
    turn_limited = False
    full_text = True
