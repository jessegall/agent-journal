from core.modules.agents.support.report_nudges import PARENT_REPORT_SOURCE
from suites.coding.modules.workers.support.test_limit_nudges import WORKER_TEST_LIMIT_SOURCE

SILENT_AGENT_SOURCE = "workers.silent-agent"
WORKER_JOB_SOURCE = "workers.worker-job"
WAITING_TASKS_SOURCE = "workers.waiting-tasks"
MERGE_CONFLICT_SOURCE = "workers.merge-clash"
UNFINISHED_TASKS_SOURCE = "workers.unfinished-tasks"
# how many times a worker is told to go on, since a task of it last moved, before its main agent is told it keeps stopping
RESUME_LIMIT_COUNT = 3
SHORT_PROOF_SOURCE = "workers.short-proof"
RESUMING_SOURCES = (PARENT_REPORT_SOURCE, WORKER_TEST_LIMIT_SOURCE, WORKER_JOB_SOURCE, MERGE_CONFLICT_SOURCE, UNFINISHED_TASKS_SOURCE, SHORT_PROOF_SOURCE)
