from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_TEST_LIMIT_SOURCE = "processes.worker-test-limit"
TEST_LIMIT_STOP = NudgeDeclaration("processes.run_over_test_limit", NudgeType.STEERING, "output {output} stopped: {count} tests, worker limit {limit}; run only tests for this task", longest_characters=240, wakes_agent=True)
TEST_LIMIT_REFUSAL = NudgeDeclaration("processes.test_run_over_limit", NudgeType.REFUSAL, "last run had {count} tests, limit {limit}: {command}; run only tests for this task", longest_characters=320)
