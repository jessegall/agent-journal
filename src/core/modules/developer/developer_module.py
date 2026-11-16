from core.modules.developer.support.developer_dependencies import DEVELOPER_DEPENDENCIES
from core.modules.developer.support.developer_subcommands import DEVELOPER_SUBCOMMANDS
from core.modules.developer.windows.developer_windows import DEVELOPER_WINDOWS
from core.modules.developer.models.declarations.private_data_mark_model_declaration import PrivateDataMarkModelDeclaration
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
from core.modules.developer.commands.record_mark_motion.record_mark_motion_handler import RecordMarkMotionHandler
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers_handler import ResetHookNumbersHandler
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
    dependencies = DEVELOPER_DEPENDENCIES
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
    subcommands = DEVELOPER_SUBCOMMANDS
    windows = DEVELOPER_WINDOWS
