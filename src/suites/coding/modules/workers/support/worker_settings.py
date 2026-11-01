from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.suites.coding.workers"
DISPATCHES_WORKERS_SETTING = f"{MODULE_KEY}.builder-dispatches-workers"
LIBRARY_LINKS = f"{MODULE_KEY}.library-links"
LIBRARY_COPIES = f"{MODULE_KEY}.library-copies"
WORKTREE_COMMANDS = f"{MODULE_KEY}.worktree-commands"
WORKER_LIMIT = f"{MODULE_KEY}.worker-limit"
ALLOWED_MODELS = f"{MODULE_KEY}.allowed-models"
WORKER_SETTINGS = [
    SettingValue("builder-dispatches-workers", "Builder sends workers", "Whether the builder may send workers.", SettingType.FLAG, default=True),
    SettingValue("worker-limit", "Worker limit", "How many workers an environment may have out at once.", SettingType.NUMBER, default=2),
    SettingValue("allowed-models", "Allowed worker models", "Models a worker may run on, such as claude sonnet; a program with none listed may use all.",
                 SettingType.LIST, default=()),
    SettingValue("library-links", "Library links", "Folders each worker's worktree links from the main checkout.", SettingType.LIST, default=()),
    SettingValue("library-copies", "Library copies", "Folders each worker's worktree gets a copy of.", SettingType.LIST, default=()),
    SettingValue("worktree-commands", "Worktree commands", "Commands run in each new worker worktree before the worker starts.",
                 SettingType.LIST, default=()),
]
