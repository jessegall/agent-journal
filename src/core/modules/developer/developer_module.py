from core.modules.developer.windows.developer_windows import DEVELOPER_WINDOWS
from core.modules.developer.models.declarations.private_data_mark_model_declaration import PrivateDataMarkModelDeclaration
from core.modules.developer.commands.code_map.code_map_subcommand import CodeMapSubcommand
from core.modules.developer.migrations.m003_private_data_mark_environment_index import PrivateDataMarkEnvironmentIndexMigration
from core.modules.developer.commands.record_private_data_finding.record_private_data_finding_handler import RecordPrivateDataFindingHandler
from core.modules.developer.listeners.private_data_mark_listener import PrivateDataMarkListener
from core.modules.developer.migrations.m002_private_data_marks import PrivateDataFlagsMigration
from core.modules.developer.support.developer_agent_messages import DEVELOPER_AGENT_MESSAGES
from core.modules.developer.listeners.exception_line_listener import ExceptionLineListener
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from engine.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.developer_route_cost_tool import DeveloperRouteCostTool
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from core.modules.developer.commands.hook_numbers.hook_numbers_subcommand import HookNumbersSubcommand
from core.modules.developer.commands.hook_requests.hook_requests_subcommand import HookRequestsSubcommand
from core.modules.developer.commands.system_logs.system_logs_subcommand import SystemLogsSubcommand
from core.modules.developer.commands.mark_motions.mark_motions_subcommand import MarkMotionsSubcommand
from core.modules.developer.commands.record_mark_motion.record_mark_motion_handler import RecordMarkMotionHandler
from core.modules.developer.commands.record_mark_motion.record_mark_motion_subcommand import RecordMarkMotionSubcommand
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_handler import ResetHookNumbersHandler
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_subcommand import ResetHookNumbersSubcommand
from engine.database.request_watch import RequestWatch
from engine.module.module import Module
from core.modules.developer.support.reporting_request_watch import ReportingRequestWatch
from core.modules.developer.support.developer_settings import DEVELOPER_SETTINGS
from core.modules.developer.models.hook_request import HookRequest
from core.modules.developer.migrations.m001_hook_requests import HookRequestsMigration
from core.modules.developer.tick_handlers.private_data_tick_handler import PrivateDataTickHandler
from core.modules.developer.tick_handlers.request_trace_import_tick_handler import RequestTraceImportTickHandler


class DeveloperModule(Module):
    """Adds the developer settings: one switch and the groups inside it, for working on the journal itself."""

    move_reason = "request history is temporary diagnostic data"
    name = "journal.core.developer"
    seed_reason = "its settings are the user's own choice"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.settings", "journal.core.chat", "journal.core.environments", "journal.core.agents"]
    settings = DEVELOPER_SETTINGS
    models = [PrivateDataMarkModelDeclaration]
    migrations = [PrivateDataMarkEnvironmentIndexMigration, HookRequestsMigration, PrivateDataFlagsMigration]
    views = [HookRequest]
    tick_handlers = [PrivateDataTickHandler, RequestTraceImportTickHandler]
    handlers = [RecordPrivateDataFindingHandler, ResetHookNumbersHandler, RecordMarkMotionHandler]
    listeners = [ExceptionLineListener, PrivateDataMarkListener]
    agent_messages = DEVELOPER_AGENT_MESSAGES
    bindings = {RouteCostTool: DeveloperRouteCostTool, RequestWatch: ReportingRequestWatch}
    performance_tools = [SlowTickTool, ReaderTimeTool, RouteCostTool]
    subcommands = [SystemLogsSubcommand, HookNumbersSubcommand, HookRequestsSubcommand, ResetHookNumbersSubcommand, RecordMarkMotionSubcommand, MarkMotionsSubcommand, CodeMapSubcommand]
    windows = DEVELOPER_WINDOWS
