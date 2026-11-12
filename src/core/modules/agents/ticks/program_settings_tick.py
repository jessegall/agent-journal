from engine.container.container import Container
from engine.enums.log_level import LogLevel
from engine.errors.refusal import Refusal
from engine.log.system_log_writer import SystemLogWriter
from engine.provider.program_settings_sync import ProgramSettingsSync


class ProgramSettingsTick:
    """Writes the journal's own settings files of each agent program: at server start after backing up the
    person's own files, and on every later tick only the journal's files, so a tick never fills the backups. A
    failure is logged, never raised."""

    def __init__(self) -> None:
        self.has_prepared = False

    def __call__(self, container: Container) -> None:
        try:
            self.update(container.get(ProgramSettingsSync))
        except Refusal as refusal:
            container.get(SystemLogWriter).write(LogLevel.WARNING, refusal.reason)

    def update(self, sync: ProgramSettingsSync) -> None:
        if self.has_prepared:
            sync.write_all()
            return
        sync.prepare_all()
        self.has_prepared = True
