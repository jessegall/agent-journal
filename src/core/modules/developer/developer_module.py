from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.developer.commands.hook_numbers.hook_numbers_subcommand import HookNumbersSubcommand
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_handler import ResetHookNumbersHandler
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_subcommand import ResetHookNumbersSubcommand
from core.base.module.module import Module
from core.modules.developer.support.developer_settings import DEVELOPER_SETTINGS


class DeveloperModule(Module):
    """Adds the developer settings: one switch and the groups inside it, for working on the journal itself."""

    move_reason = "it owns no tables"
    name = "journal.core.developer"
    seed_reason = "its settings are the person's own choice"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.settings"]
    settings = DEVELOPER_SETTINGS
    handlers = [ResetHookNumbersHandler]
    subcommands = [HookNumbersSubcommand, ResetHookNumbersSubcommand]
    windows = [WindowDeclaration("developer.numbers", "Numbers", "numbers.js", WindowLoading.COMPONENT, group="project", icon=WindowIcon.FITNESS, reads=["developer numbers"], runs=["developer reset-numbers"])]
