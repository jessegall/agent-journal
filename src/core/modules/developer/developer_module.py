from core.modules.developer.migrations.m003_private_data_mark_environment_index import PrivateDataMarkEnvironmentIndexMigration
from core.base.module.model_declaration import ModelDeclaration
from core.modules.developer.commands.record_private_data_finding.record_private_data_finding_handler import RecordPrivateDataFindingHandler
from core.modules.developer.listeners.private_data_mark_listener import PrivateDataMarkListener
from core.modules.developer.migrations.m002_private_data_marks import PrivateDataFlagsMigration
from core.modules.developer.models.private_data_mark import PrivateDataMark
from core.modules.developer.commands.request_queue.request_queue_subcommand import RequestQueueSubcommand
from core.modules.developer.support.developer_nudges import DEVELOPER_NUDGES
from core.modules.developer.listeners.exception_line_listener import ExceptionLineListener
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from engine.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.developer_route_cost_tool import DeveloperRouteCostTool
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.developer.commands.hook_numbers.hook_numbers_subcommand import HookNumbersSubcommand
from core.modules.developer.commands.hook_requests.hook_requests_subcommand import HookRequestsSubcommand
from core.modules.developer.commands.system_logs.system_logs_subcommand import SystemLogsSubcommand
from core.modules.developer.commands.mark_motions.mark_motions_subcommand import MarkMotionsSubcommand
from core.modules.developer.commands.record_mark_motion.record_mark_motion_handler import RecordMarkMotionHandler
from core.modules.developer.commands.record_mark_motion.record_mark_motion_subcommand import RecordMarkMotionSubcommand
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_handler import ResetHookNumbersHandler
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_subcommand import ResetHookNumbersSubcommand
from core.base.database.request_watch import RequestWatch
from core.base.module.module import Module
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.modules.developer.ticks.private_data_tick import PrivateDataTick
from core.modules.developer.support.reporting_request_watch import ReportingRequestWatch
from core.modules.developer.support.developer_settings import DEVELOPER_SETTINGS, TOOLS_SETTING, HOOK_DURATIONS_SETTING, HOOK_REQUEST_LOG_SETTING
from core.modules.developer.support.skeletons import DEVELOPER_NUMBERS_SKELETON, DEVELOPER_HOOK_REQUESTS_SKELETON
from core.modules.developer.models.hook_request import HookRequest
from core.modules.developer.migrations.m001_hook_requests import HookRequestsMigration


class DeveloperModule(Module):
    """Adds the developer settings: one switch and the groups inside it, for working on the journal itself."""

    move_reason = "request history is temporary diagnostic data"
    name = "journal.core.developer"
    seed_reason = "its settings are the person's own choice"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.settings", "journal.core.chat", "journal.core.environments", "journal.core.agents"]
    settings = DEVELOPER_SETTINGS
    models = [ModelDeclaration(PrivateDataMark, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [PrivateDataMarkEnvironmentIndexMigration, HookRequestsMigration, PrivateDataFlagsMigration]
    views = [HookRequest]
    tick_handlers = [TickHandler(TickInterval(seconds=60), PrivateDataTick(), "private data scan")]
    handlers = [RecordPrivateDataFindingHandler, ResetHookNumbersHandler, RecordMarkMotionHandler]
    listeners = [ExceptionLineListener, PrivateDataMarkListener]
    nudges = DEVELOPER_NUDGES
    bindings = {RouteCostTool: DeveloperRouteCostTool, RequestWatch: ReportingRequestWatch}
    performance_tools = [SlowTickTool, ReaderTimeTool, RouteCostTool]
    subcommands = [SystemLogsSubcommand, RequestQueueSubcommand, HookNumbersSubcommand, HookRequestsSubcommand, ResetHookNumbersSubcommand, RecordMarkMotionSubcommand, MarkMotionsSubcommand]
    windows = [WindowDeclaration("developer.numbers", "Numbers", "numbers.js", WindowLoading.COMPONENT, skeleton=DEVELOPER_NUMBERS_SKELETON, place=WindowPlace.PAGE, group="developer", required_settings=[TOOLS_SETTING, HOOK_DURATIONS_SETTING], icon=WindowIcon.FITNESS, reads=["developer numbers"], runs=["developer reset-numbers"],
                                 keys=[WindowKey("numbers", "developer numbers", switches=["costliest"], reload_seconds=10)]),
               WindowDeclaration("developer.hook-requests", "Request log", "hookRequests.js", WindowLoading.COMPONENT, skeleton=DEVELOPER_HOOK_REQUESTS_SKELETON, place=WindowPlace.PAGE, group="developer", required_settings=[TOOLS_SETTING, HOOK_REQUEST_LOG_SETTING], icon=WindowIcon.RULE, reads=["developer hook-requests", "developer request-queue"], unqueued=True,
                                 keys=[WindowKey("requests", "developer hook-requests", arguments=["categories", "families", "senders"]),
                                       WindowKey("queue", "developer request-queue", loading=KeyLoading.REQUESTED)]),
               WindowDeclaration("developer.system-logs", "System logs", "systemLogs.js", WindowLoading.COMPONENT, skeleton=DEVELOPER_HOOK_REQUESTS_SKELETON, place=WindowPlace.PAGE, group="developer", required_settings=[TOOLS_SETTING], icon=WindowIcon.RULE, reads=["developer system-logs"], unqueued=True,
                                 keys=[WindowKey("logs", "developer system-logs", arguments=["page", "source", "level", "limit"])])]
