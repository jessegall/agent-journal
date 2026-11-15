from engine.driver.nudge_declaration import NudgeDeclaration
from suites.coding.models.enums.ask_topic import AskTopic
from engine.enums.nudge_type import NudgeType


class WorkerTestCommandsMissingNudge(NudgeDeclaration):
    """The nudge workers.no_test_commands."""

    key = "workers.no_test_commands"
    type = NudgeType.SAFETY_REFUSAL
    text = "You have no test commands, so no test can run for you. Only the main agent gives them: journal worker send {worker} --test-command <name>=<command>. " + AskTopic.TESTS.question_line()
    turn_limited = False
    full_text = True
