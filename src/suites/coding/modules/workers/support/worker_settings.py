from core.base.setting.ruled_settings import ruled_settings
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.modules.helpers.support.command_pair_rule import CommandPairRule
from core.base.setting.list_rule import ListRule
from core.base.setting.number_rule import NumberRule

MODULE_KEY = "journal.suites.coding.workers"
DISPATCHES_WORKERS_SETTING = f"{MODULE_KEY}.main-dispatches-workers"
LIBRARY_LINKS = f"{MODULE_KEY}.library-links"
LIBRARY_COPIES = f"{MODULE_KEY}.library-copies"
WORKTREE_COMMANDS_NAME = "worktree-commands"
WORKTREE_COMMANDS = f"{MODULE_KEY}.{WORKTREE_COMMANDS_NAME}"
MERGE_COMMANDS_NAME = "merge-commands"
MERGE_COMMANDS = f"{MODULE_KEY}.{MERGE_COMMANDS_NAME}"
WORKER_RUN_LIMIT = f"{MODULE_KEY}.worker-run-limit"
WORKER_KEPT_LIMIT = f"{MODULE_KEY}.worker-kept-limit"
DEFAULT_WORKER_COUNT = 2
SILENT_AGENT_MINUTES = f"{MODULE_KEY}.silent-agent-minutes"
IDLE_WORKER_MINUTES = f"{MODULE_KEY}.idle-worker-minutes"
IDLE_WORKER_REPEAT_MINUTES = f"{MODULE_KEY}.idle-worker-repeat-minutes"
INACTIVE_HELPER_MINUTES = f"{MODULE_KEY}.quiet-helper-minutes"
INACTIVE_HELPER_GRACE_MINUTES = f"{MODULE_KEY}.quiet-helper-grace-minutes"
WORKER_BATCH_SIZE = f"{MODULE_KEY}.worker-batch-size"
WORKER_IDLE_HOURS = f"{MODULE_KEY}.worker-idle-hours"
PHASE_TESTS_ENABLED = f"{MODULE_KEY}.test-at-phase-end"
TEST_BATCH_SIZE = f"{MODULE_KEY}.test-batch-size"
WORKER_PHASE_TEST_RUNS = f"{MODULE_KEY}.worker-phase-test-runs"
WORKER_TEST_LIMIT = f"{MODULE_KEY}.worker-run-most-tests"
MERGER_ENABLED = f"{MODULE_KEY}.merger-on"
MERGER_WAIT_MINUTES = f"{MODULE_KEY}.merger-wait-minutes"
MERGER_COMMANDS = f"{MODULE_KEY}.merger-commands"
DELIVERY_FAILURE_LIMIT = f"{MODULE_KEY}.hand-in-failures-to-flag"
WORKER_RUN_FAILURE_LIMIT = f"{MODULE_KEY}.own-test-failures-to-flag"
AFFECTED_TESTS_COMMAND = f"{MODULE_KEY}.affected-tests-command"
PROJECT_TEST_COMMAND = f"{MODULE_KEY}.project-test-command"
MAIN_MERGES_WORKERS = f"{MODULE_KEY}.main-agent-may-merge"
RESUME_SILENT_AGENTS = f"{MODULE_KEY}.resume-silent-agents"
WORKERS_START_HELPERS = f"{MODULE_KEY}.workers-start-helpers"
WORKER_SANDBOX = f"{MODULE_KEY}.worker-sandbox"
PROTECTED_FOLDERS = f"{MODULE_KEY}.protected-folders"
WORKER_SETTING_VALUES = [
    SettingValue("idle-worker-minutes", "Worker idle warning", "Minutes without activity before a worker with work left is reported.", SettingType.NUMBER, default=15, person_set=True, depends_on=[MERGER_ENABLED]),
    SettingValue("idle-worker-repeat-minutes", "Worker idle warning repeat", "Minutes between warnings about a worker with work left.", SettingType.NUMBER, default=5, person_set=True),
    SettingValue("test-at-phase-end", "Test at phase end", "Test plan tasks together at the end of each phase. Off tests each task when handed in.", SettingType.FLAG, default=True, person_set=True),
    SettingValue("test-batch-size", "Tasks per test batch", "Tasks outside a plan to finish before testing together. The last task also ends a batch.", SettingType.NUMBER, default=1, person_set=True),
    SettingValue("worker-phase-test-runs", "Test commands per phase or batch", "Test commands a worker may run in each phase or batch before asking the main agent.", SettingType.NUMBER, default=3, person_set=True),
    SettingValue("silent-agent-minutes", "Silent agent minutes", "Minutes without tool use or a running command before an agent with unfinished work is resumed.", SettingType.NUMBER, default=3, person_set=True),
    SettingValue("affected-tests-command", "Affected tests command", "Find tests for changed files, one argument per line. Set the project test command too.", SettingType.TEXT, default="", person_set=True),
    SettingValue("project-test-command", "Project test command", "Run selected test arguments. Set the affected tests command too.", SettingType.TEXT, default="", person_set=True),
    SettingValue("worker-run-most-tests", "Test limit per worker command", "A worker command running more tests than this is refused or stopped. 0 means no limit. Journal runs do not count.", SettingType.NUMBER, default=25, person_set=True),
    SettingValue("hand-in-failures-to-flag", "Failed hand-ins to flag", "Failed hand-ins of a task after which the main agent must read a line about it.", SettingType.NUMBER, default=3, person_set=True),
    SettingValue("own-test-failures-to-flag", "Failed own tests to flag", "Failures of one test file in a worker's own runs after which the main agent must read a line about it.", SettingType.NUMBER, default=5, person_set=True),
    SettingValue("merger-on", "Merger takes in workers", "A helper merges workers whose tests passed, and passes on what the main agent must judge.", SettingType.FLAG, default=True, person_set=True, depends_on=[DISPATCHES_WORKERS_SETTING]),
    SettingValue("merger-wait-minutes", "Merger wait minutes", "Minutes the merger has to take in a worker whose tests passed, before the main agent is told to merge it.", SettingType.NUMBER, default=15, person_set=True),
    SettingValue("merger-commands", "Merger commands", "Lines the merger runs after each merge, sending what they find to the worker. {commit} is the commit before it.", SettingType.LIST, default=(), person_set=True, depends_on=[MERGER_ENABLED]),
    SettingValue("main-dispatches-workers", "Main agent sends workers", "Whether the main agent may send workers to do tasks.", SettingType.FLAG, default=True, person_set=True),
    SettingValue("main-agent-may-merge", "Main agent may merge workers", "Whether the main agent may merge the work of a worker itself.", SettingType.FLAG, default=True, person_set=True, depends_on=[DISPATCHES_WORKERS_SETTING]),
    SettingValue("resume-silent-agents", "Resume silent agents", "Whether a worker or helper with unfinished work that has gone silent is resumed.", SettingType.FLAG, default=True, person_set=True),
    SettingValue("workers-start-helpers", "Workers may use ordinary helpers", "Whether a worker may start ordinary helpers for the task it works on.", SettingType.FLAG, default=True, person_set=True),
    SettingValue("worker-sandbox", "Worker sandbox", "Workers run their commands in a sandbox that lets them write only in the working folder of the worker.", SettingType.FLAG, default=True, person_set=True),
    SettingValue("protected-folders", "Protected folders", "Paths or globs workers may not change.", SettingType.LIST, default=(), person_set=True, main_agent_only=True),
    SettingValue("worker-run-limit", "Workers running", "Workers that run at once in an environment. At 0 none run.", SettingType.NUMBER, default=DEFAULT_WORKER_COUNT, person_set=True),
    SettingValue("worker-kept-limit", "Workers kept", "Workers kept, running or idle, until retired. At 0 there is no limit.", SettingType.NUMBER, default=8, person_set=True),
    SettingValue("worker-idle-hours", "Worker idle hours", "Hours without tool use before an unfinished worker's process stops. Its task and working folder stay.", SettingType.NUMBER, default=6, person_set=True),
    SettingValue("worker-batch-size", "Worker batch size", "Recommended tasks per worker assignment. The main agent is prompted to add more when fewer are assigned.", SettingType.NUMBER, default=3, person_set=True),
    SettingValue("quiet-helper-grace-minutes", "Quiet helper grace minutes", "Minutes without tool use, or with work that has not started, before the main agent first hears of a worker or helper.", SettingType.NUMBER, default=15, person_set=True),
    SettingValue("quiet-helper-minutes", "Quiet helper minutes", "Minutes between the reminders to the main agent, until the worker or helper is stopped or back at work.", SettingType.NUMBER, default=5, person_set=True),
    SettingValue("library-links", "Library links", "Folders each worker's worktree links from the main checkout.", SettingType.LIST, default=()),
    SettingValue("library-copies", "Library copies", "Folders each worker's worktree gets a copy of.", SettingType.LIST, default=()),
    SettingValue(WORKTREE_COMMANDS_NAME, "Worktree commands", "Commands run in each new worker worktree before the worker starts.",
                 SettingType.LIST, default=()),
    SettingValue(MERGE_COMMANDS_NAME, "Merge commands", "Commands run in the main checkout after each worker merge, such as a push. The task closes only when they all succeed.",
                 SettingType.LIST, default=(), person_set=True),
]
WORKER_SETTING_RULES = {WORKER_RUN_LIMIT: NumberRule(0),
                        WORKER_KEPT_LIMIT: NumberRule(0),
                        WORKER_BATCH_SIZE: NumberRule(1),
                        SILENT_AGENT_MINUTES: NumberRule(1),
                        WORKER_IDLE_HOURS: NumberRule(0, integer=False, exclusive=True),
                        IDLE_WORKER_MINUTES: NumberRule(1),
                        IDLE_WORKER_REPEAT_MINUTES: NumberRule(1),
                        INACTIVE_HELPER_GRACE_MINUTES: NumberRule(1),
                        INACTIVE_HELPER_MINUTES: NumberRule(1),
                        TEST_BATCH_SIZE: NumberRule(1),
                        WORKER_PHASE_TEST_RUNS: NumberRule(0),
                        WORKER_TEST_LIMIT: NumberRule(0),
                        DELIVERY_FAILURE_LIMIT: NumberRule(1),
                        WORKER_RUN_FAILURE_LIMIT: NumberRule(1),
                        MERGER_WAIT_MINUTES: NumberRule(1),
                        MERGER_COMMANDS: ListRule(),
                        PROTECTED_FOLDERS: ListRule(),
                        MERGE_COMMANDS: ListRule()}
WORKER_SETTINGS = ruled_settings(MODULE_KEY, WORKER_SETTING_VALUES, WORKER_SETTING_RULES)
TEST_COMMAND_PAIR = CommandPairRule(AFFECTED_TESTS_COMMAND, PROJECT_TEST_COMMAND)
