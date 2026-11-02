import json
from collections.abc import Mapping

from core.base.clock import Clock
from core.base.journal_home import JournalHome
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING, HOOK_REQUEST_LOG_SIZE_SETTING
from core.modules.developer.support.hook_request import HookRequest
from core.modules.settings.bindings.support.setting_values import SettingValues

REQUESTS_FILE = "hook-requests.json"


class HookRequestLog:
    """The last hooks as they were sent to the journal, kept in a file of the runtime folder while the developer
    option is on, so a hook writes no row to log itself. The oldest drop off past the size the setting names. A
    file that cannot be read or written costs the log its rows, never the hook its answer."""

    def __init__(self, home: JournalHome, settings: SettingValues, clock: Clock) -> None:
        self.path = home.costly_hooks_log.parent / REQUESTS_FILE
        self.settings, self.clock = settings, clock

    def read(self) -> list[HookRequest]:
        try:
            return [HookRequest(**row) for row in json.loads(self.path.read_text())] if self.path.exists() else []
        except (OSError, TypeError, ValueError):
            return []

    def record(self, program: str, headers: Mapping[str, str], body: object) -> None:
        if not self.settings.flag(HOOK_REQUEST_LOG_SETTING, None):
            return
        rows = self.read()
        number = rows[0].number + 1 if rows else 1
        request = HookRequest(number, self.clock.timestamp().text, program, dict(headers), body)
        kept = [request, *rows][: max(self.settings.number(HOOK_REQUEST_LOG_SIZE_SETTING, None), 1)]
        try:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            self.path.write_text(json.dumps([vars(row) for row in kept]))
        except (OSError, TypeError, ValueError):
            return
