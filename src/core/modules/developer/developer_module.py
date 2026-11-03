from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from core.base.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.developer_route_cost_tool import DeveloperRouteCostTool
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.developer.commands.hook_numbers.hook_numbers_subcommand import HookNumbersSubcommand
from core.modules.developer.commands.hook_requests.hook_requests_subcommand import HookRequestsSubcommand
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_handler import ResetHookNumbersHandler
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_subcommand import ResetHookNumbersSubcommand
from core.base.module.module import Module
from core.modules.developer.support.developer_settings import DEVELOPER_SETTINGS
from core.modules.developer.support.skeletons import DEVELOPER_NUMBERS_SKELETON, DEVELOPER_HOOK_REQUESTS_SKELETON


class DeveloperModule(Module):
    """Adds the developer settings: one switch and the groups inside it, for working on the journal itself."""

    move_reason = "it owns no tables"
    name = "journal.core.developer"
    seed_reason = "its settings are the person's own choice"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.settings"]
    settings = DEVELOPER_SETTINGS
    handlers = [ResetHookNumbersHandler]
    bindings = [(RouteCostTool, DeveloperRouteCostTool)]
    performance_tools = [SlowTickTool, ReaderTimeTool, RouteCostTool]
    subcommands = [HookNumbersSubcommand, HookRequestsSubcommand, ResetHookNumbersSubcommand]
    windows = [WindowDeclaration("developer.numbers", "Numbers", "numbers.js", WindowLoading.COMPONENT, skeleton=DEVELOPER_NUMBERS_SKELETON, group="project", icon=WindowIcon.FITNESS, reads=["developer numbers"], runs=["developer reset-numbers"]),
               WindowDeclaration("developer.hook-requests", "Hook requests", "hookRequests.js", WindowLoading.COMPONENT, skeleton=DEVELOPER_HOOK_REQUESTS_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.RULE, reads=["developer hook-requests"])]
