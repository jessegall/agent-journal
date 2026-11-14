from engine.container.container import Container
from engine.database.database import Database
from engine.database.hook_requests_table import HookRequestsTable
from engine.setting.setting_values import SettingValues
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SIZE_SETTING
from core.modules.developer.support.request_trace_file import RequestTraceFile


class RequestTraceImport:
    """Writes the developer trace's rows and read receipts the server appended to its file, as one
    transaction a round, keeping of the table the number the request log size names."""

    def __call__(self, container: Container) -> None:
        size = max(container.get(SettingValues).project.number(HOOK_REQUEST_LOG_SIZE_SETTING), 1)
        container.get(RequestTraceFile).import_rows(container.get(Database), container.get(HookRequestsTable), size)
