from engine.database.database_busy import DatabaseBusy
import sqlite3
from pathlib import Path

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.enums.log_level import LogLevel
from engine.query.queries import Queries
from engine.log.system_log_writer import SystemLogWriter
from core.modules.drivers.models.hook_call import HookCall
from core.modules.messages.commands.reset_message_deliveries.reset_message_deliveries import ResetMessageDeliveries



class HookDeliveryRetries:
    """Keeps lost hook answers on disk until their message deliveries have been reset. A retry never
    fails the hook that runs it: a busy database leaves the file for the next hook, and a file that
    cannot be retried is logged once and removed."""

    def __init__(self, home: JournalHome) -> None:
        self.folder = home.folder / "runtime" / "lost-hook-answers"

    def keep(self, hook_call_id: int) -> None:
        FileAccess.mkdir(self.folder, parents=True, exist_ok=True)
        FileAccess.update_timestamp(self.folder / str(hook_call_id))

    def retry(self, container: Container) -> None:
        for path in FileAccess.glob(self.folder, "*"):
            if FileAccess.is_file(path):
                self.retry_file(path, container)

    def retry_file(self, path: Path, container: Container) -> None:
        try:
            call = container.get(Queries).query(HookCall).find(int(path.name))
            container.get(Bus).run(ResetMessageDeliveries(call.id), Actor.core(), environment_id=call.environment_id)
        except sqlite3.OperationalError as error:
            if DatabaseBusy.is_busy(error):
                container.get(SystemLogWriter).write(LogLevel.WARNING, f"delivery reset of lost hook answer {path.name} will retry at the next hook: {error}")
                return
            self.note_removal(path, error, container)
        except Exception as error:
            self.note_removal(path, error, container)
        FileAccess.unlink(path, missing_ok=True)

    @staticmethod
    def note_removal(path: Path, error: Exception, container: Container) -> None:
        container.get(SystemLogWriter).write(LogLevel.WARNING, f"lost hook answer {path.name} cannot be retried and is removed: {type(error).__name__}: {error}")
