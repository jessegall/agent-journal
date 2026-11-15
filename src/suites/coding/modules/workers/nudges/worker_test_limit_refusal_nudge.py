from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from suites.coding.models.enums.ask_topic import AskTopic


class WorkerTestLimitRefusalNudge(NudgeDeclaration):
    """The nudge processes.test_run_over_limit."""

    key = "processes.test_run_over_limit"
    type = NudgeType.REFUSAL
    text = "last run had {count} tests, limit {limit}. Do not split it: run only what proves your change; proofs run at hand-in. " + AskTopic.TESTS.question_line()
    full_text = True
