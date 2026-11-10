from engine.log.refusal_log import RefusalLog
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.errors.reader_save_refusal import ReaderSaveRefusal


class ReaderSaveAttempts:
    """Reads failed saves that remain after the refused command's rollback."""

    def __init__(self, refusals: RefusalLog, settings: ProcessSettings) -> None:
        self.refusals, self.settings = refusals, settings

    def needs_help(self, request: ReaderRequest) -> bool:
        limit = self.settings.integer(ProcessSetting.READER_SAVE_TRIES)
        return self.refusals.count_with_reason(ReaderSaveRefusal.prefix(request.id)) >= max(0, limit)
