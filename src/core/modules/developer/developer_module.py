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
from core.modules.developer.commands.mark_motions.mark_motions_subcommand import MarkMotionsSubcommand
from core.modules.developer.commands.record_mark_motion.record_mark_motion_handler import RecordMarkMotionHandler
from core.modules.developer.commands.record_mark_motion.record_mark_motion_subcommand import RecordMarkMotionSubcommand
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_handler import ResetHookNumbersHandler
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_subcommand import ResetHookNumbersSubcommand
from core.base.module.module import Module
from core.modules.developer.support.developer_settings import DEVELOPER_SETTINGS, TOOLS_SETTING, HOOK_REQUEST_LOG_SETTING
from core.modules.developer.support.skeletons import DEVELOPER_NUMBERS_SKELETON, DEVELOPER_HOOK_REQUESTS_SKELETON
from core.modules.developer.models.hook_request import HookRequest
from core.modules.developer.migrations.m001_hook_requests import HookRequestsMigration


class DeveloperModule(Module):
    """Adds the developer settings: one switch and the groups inside it, for working on the journal itself."""

    move_reason = "request history is temporary diagnostic data"
    name = "journal.core.developer"
    seed_reason = "its settings are the person's own choice"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.settings"]
    settings = DEVELOPER_SETTINGS
    migrations = [HookRequestsMigration]
    views = [HookRequest]
    handlers = [ResetHookNumbersHandler, RecordMarkMotionHandler]
    bindings = [(RouteCostTool, DeveloperRouteCostTool)]
    performance_tools = [SlowTickTool, ReaderTimeTool, RouteCostTool]
    subcommands = [HookNumbersSubcommand, HookRequestsSubcommand, ResetHookNumbersSubcommand, RecordMarkMotionSubcommand, MarkMotionsSubcommand]
    windows = [WindowDeclaration("developer.numbers", "Numbers", "numbers.js", WindowLoading.COMPONENT, skeleton=DEVELOPER_NUMBERS_SKELETON, place=WindowPlace.PAGE, group="developer", required_settings=[TOOLS_SETTING], icon=WindowIcon.FITNESS, reads=["developer numbers"], runs=["developer reset-numbers"]),
               WindowDeclaration("developer.hook-requests", "Hook requests", "hookRequests.js", WindowLoading.COMPONENT, skeleton=DEVELOPER_HOOK_REQUESTS_SKELETON, place=WindowPlace.PAGE, group="developer", required_settings=[TOOLS_SETTING, HOOK_REQUEST_LOG_SETTING], icon=WindowIcon.RULE, reads=["developer hook-requests"])]
