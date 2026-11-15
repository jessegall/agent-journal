from engine.driver.nudge_declaration import NudgeDeclaration
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts
from engine.enums.nudge_type import NudgeType
from suites.coding.models.enums.ask_topic import AskTopic


class WorkerTestCountUnknownNudge(NudgeDeclaration):
    """The nudge processes.test_count_unknown."""

    key = "processes.test_count_unknown"
    type = NudgeType.STEERING
    text = ("Output {output} stopped: could not count the tests, read that output for why. Exits: "
                                        + ExitTexts.template(tuple([ReadingExit.COUNT_TESTS])) + ". " + AskTopic.TESTS.question_line())
    wakes_agent = True
    full_text = True
