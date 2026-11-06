from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.suites.coding.workers"
DISPATCHES_WORKERS_SETTING = f"{MODULE_KEY}.builder-dispatches-workers"
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
INACTIVE_HELPER_MINUTES = f"{MODULE_KEY}.quiet-helper-minutes"
INACTIVE_HELPER_GRACE_MINUTES = f"{MODULE_KEY}.quiet-helper-grace-minutes"
WORKER_BATCH_SIZE = f"{MODULE_KEY}.worker-batch-size"
WORKER_IDLE_HOURS = f"{MODULE_KEY}.worker-idle-hours"
WORKER_TEST_LIMIT = f"{MODULE_KEY}.worker-run-most-tests"
HAND_IN_FAILURES_TO_FLAG = f"{MODULE_KEY}.hand-in-failures-to-flag"
OWN_TEST_FAILURES_TO_FLAG = f"{MODULE_KEY}.own-test-failures-to-flag"
AFFECTED_TESTS_COMMAND = f"{MODULE_KEY}.affected-tests-command"
PROJECT_TEST_COMMAND = f"{MODULE_KEY}.project-test-command"
WORKER_SETTINGS = [
    SettingValue("silent-agent-minutes", "Silent agent minutes", "Minutes without tool use or a running command before an agent with unfinished work is resumed.", SettingType.NUMBER, default=3),
    SettingValue("affected-tests-command", "Affected tests command", "Find tests for changed files, one argument per line. Set the project test command too.", SettingType.TEXT, default=""),
    SettingValue("project-test-command", "Project test command", "Run selected test arguments. Set the affected tests command too.", SettingType.TEXT, default=""),
    SettingValue("worker-run-most-tests", "Test limit per worker command", "A worker command running more tests than this is refused or stopped. 0 means no limit. Journal runs do not count.", SettingType.NUMBER, default=25, person_set=True),
    SettingValue("hand-in-failures-to-flag", "Failed hand-ins to flag", "Failed hand-ins of a task after which the main agent must read a line about it.", SettingType.NUMBER, default=3),
    SettingValue("own-test-failures-to-flag", "Failed own tests to flag", "Failures of one test file in a worker's own runs after which the main agent must read a line about it.", SettingType.NUMBER, default=5),
    SettingValue("builder-dispatches-workers", "Builder sends workers", "Whether the builder may send workers.", SettingType.FLAG, default=True, person_set=True),
    SettingValue("worker-run-limit", "Workers running", "Workers that run at once in an environment. At 0 none run.", SettingType.NUMBER, default=DEFAULT_WORKER_COUNT, person_set=True),
    SettingValue("worker-kept-limit", "Workers kept", "Workers kept, running or idle, until retired. At 0 there is no limit.", SettingType.NUMBER, default=8, person_set=True),
    SettingValue("worker-idle-hours", "Worker idle hours", "Hours without tool use before an unfinished worker's process stops. Its task and working folder stay.", SettingType.NUMBER, default=6),
    SettingValue("worker-batch-size", "Worker batch size", "Recommended tasks per worker assignment. The main agent is prompted to add more when fewer are assigned.", SettingType.NUMBER, default=3),
    SettingValue("quiet-helper-grace-minutes", "Quiet helper grace minutes", "Minutes without tool use, or with work that has not started, before the main agent first hears of a worker or helper.", SettingType.NUMBER, default=15),
    SettingValue("quiet-helper-minutes", "Quiet helper minutes", "Minutes between the reminders to the main agent, until the worker or helper is stopped or back at work.", SettingType.NUMBER, default=5),
    SettingValue("library-links", "Library links", "Folders each worker's worktree links from the main checkout.", SettingType.LIST, default=()),
    SettingValue("library-copies", "Library copies", "Folders each worker's worktree gets a copy of.", SettingType.LIST, default=()),
    SettingValue(WORKTREE_COMMANDS_NAME, "Worktree commands", "Commands run in each new worker worktree before the worker starts.",
                 SettingType.LIST, default=()),
    SettingValue(MERGE_COMMANDS_NAME, "Merge commands", "Commands run in the main checkout after each worker merge, such as a push. The task closes only when they all succeed.",
                 SettingType.LIST, default=()),
]
