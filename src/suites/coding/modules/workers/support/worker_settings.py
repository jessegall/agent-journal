from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.suites.coding.workers"
DISPATCHES_WORKERS_SETTING = f"{MODULE_KEY}.builder-dispatches-workers"
LIBRARY_LINKS = f"{MODULE_KEY}.library-links"
LIBRARY_COPIES = f"{MODULE_KEY}.library-copies"
WORKTREE_COMMANDS = f"{MODULE_KEY}.worktree-commands"
WORKER_LIMIT = f"{MODULE_KEY}.worker-limit"
DEFAULT_WORKER_COUNT = 2
SILENT_AGENT_MINUTES = f"{MODULE_KEY}.silent-agent-minutes"
INACTIVE_HELPER_MINUTES = f"{MODULE_KEY}.quiet-helper-minutes"
WORKER_BATCH_SIZE = f"{MODULE_KEY}.worker-batch-size"
WORKER_IDLE_HOURS = f"{MODULE_KEY}.worker-idle-hours"
WORKER_TEST_LIMIT = f"{MODULE_KEY}.worker-run-most-tests"
AFFECTED_TESTS_COMMAND = f"{MODULE_KEY}.affected-tests-command"
PROJECT_TEST_COMMAND = f"{MODULE_KEY}.project-test-command"
WORKER_SETTINGS = [
    SettingValue("silent-agent-minutes", "Silent agent minutes", "Minutes without tool use or a running command before an agent with unfinished work is resumed.", SettingType.NUMBER, default=3),
    SettingValue("affected-tests-command", "Affected tests command", "Find tests for changed files, one argument per line. Set the project test command too.", SettingType.TEXT, default=""),
    SettingValue("project-test-command", "Project test command", "Run selected test arguments. Set the affected tests command too.", SettingType.TEXT, default=""),
    SettingValue("worker-run-most-tests", "Test limit per worker command", "A worker command running more tests than this is refused or stopped. 0 means no limit. Journal runs do not count.", SettingType.NUMBER, default=25),
    SettingValue("builder-dispatches-workers", "Builder sends workers", "Whether the builder may send workers.", SettingType.FLAG, default=True),
    SettingValue("worker-limit", "Worker limit", "Maximum active workers per environment.", SettingType.NUMBER, default=DEFAULT_WORKER_COUNT),
    SettingValue("worker-idle-hours", "Worker idle hours", "Hours without tool use before an unfinished worker is retired and its working folder removed.", SettingType.NUMBER, default=6),
    SettingValue("worker-batch-size", "Worker batch size", "Recommended tasks per worker assignment. The main agent is prompted to add more when fewer are assigned.", SettingType.NUMBER, default=3),
    SettingValue("quiet-helper-minutes", "Quiet helper minutes", "Minutes without tool use before the main agent is prompted to check a worker or helper.", SettingType.NUMBER, default=5),
    SettingValue("library-links", "Library links", "Folders each worker's worktree links from the main checkout.", SettingType.LIST, default=()),
    SettingValue("library-copies", "Library copies", "Folders each worker's worktree gets a copy of.", SettingType.LIST, default=()),
    SettingValue("worktree-commands", "Worktree commands", "Commands run in each new worker worktree before the worker starts.",
                 SettingType.LIST, default=()),
]
