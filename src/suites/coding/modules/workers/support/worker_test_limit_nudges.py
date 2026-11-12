from engine.driver.nudge_declaration import NudgeDeclaration
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.support.reading.exit_texts import ExitTexts
from engine.enums.nudge_type import NudgeType
from suites.coding.models.enums.ask_topic import AskTopic

WORKER_TEST_LIMIT_SOURCE = "processes.worker-test-limit"
TEST_LIMIT_STOP = NudgeDeclaration("processes.run_over_test_limit", NudgeType.STEERING, "output {output} stopped: {count} tests, limit {limit}. Run only what proves your change; proofs run at hand-in", wakes_agent=True)
TEST_COUNT_UNKNOWN = NudgeDeclaration("processes.test_count_unknown", NudgeType.STEERING, "output {output} stopped: could not count the tests, read that output for why. Exits: "
                                        + ExitTexts.listed((ReadingExit.COUNT_TESTS,), "{request}", 0) + ". " + AskTopic.TESTS.question_line(), wakes_agent=True, full_text=True)
TEST_LIMIT_REFUSAL = NudgeDeclaration("processes.test_run_over_limit", NudgeType.REFUSAL, "last run had {count} tests, limit {limit}. Do not split it: run only what proves your change; proofs run at hand-in. " + AskTopic.TESTS.question_line(), full_text=True)
