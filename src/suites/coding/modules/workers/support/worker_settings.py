from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.suites.coding.workers"
DISPATCHES_WORKERS_SETTING = f"{MODULE_KEY}.builder-dispatches-workers"
LIBRARY_LINKS = f"{MODULE_KEY}.library-links"
LIBRARY_COPIES = f"{MODULE_KEY}.library-copies"
WORKTREE_COMMANDS = f"{MODULE_KEY}.worktree-commands"
WORKER_LIMIT = f"{MODULE_KEY}.worker-limit"
DEFAULT_WORKER_COUNT = 2
ALLOWED_MODELS = f"{MODULE_KEY}.allowed-models"
INACTIVE_HELPER_MINUTES = f"{MODULE_KEY}.quiet-helper-minutes"
WORKER_BATCH_SIZE = f"{MODULE_KEY}.worker-batch-size"
WORKER_IDLE_HOURS = f"{MODULE_KEY}.worker-idle-hours"
WORKER_SETTINGS = [
    SettingValue("builder-dispatches-workers", "Builder sends workers", "Whether the builder may send workers.", SettingType.FLAG, default=True),
    SettingValue("worker-limit", "Worker limit", "How many workers an environment may have out at once.", SettingType.NUMBER, default=DEFAULT_WORKER_COUNT),
    SettingValue("worker-idle-hours", "Worker idle hours", "How many hours a worker that has delivered nothing may use no tool before it is retired and its worktree removed.", SettingType.NUMBER, default=6),
    SettingValue("worker-batch-size", "Worker batch size", "How many tasks a dispatch should give a worker; a dispatch of fewer tells the main agent to queue more.", SettingType.NUMBER, default=3),
    SettingValue("quiet-helper-minutes", "Quiet helper minutes", "How many minutes a worker or subagent may use no tool before the main agent is told to check on it.", SettingType.NUMBER, default=5),
    SettingValue("allowed-models", "Allowed worker models", "Models a worker may run on, such as claude sonnet; a program with none listed may use all.",
                 SettingType.LIST, default=()),
    SettingValue("library-links", "Library links", "Folders each worker's worktree links from the main checkout.", SettingType.LIST, default=()),
    SettingValue("library-copies", "Library copies", "Folders each worker's worktree gets a copy of.", SettingType.LIST, default=()),
    SettingValue("worktree-commands", "Worktree commands", "Commands run in each new worker worktree before the worker starts.",
                 SettingType.LIST, default=()),
]
