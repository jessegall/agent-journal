from engine.actor.actor import Actor
from engine.chat.mark_outcome import MarkOutcome
from engine.command.bus import Bus
from engine.container.container import Container
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.base.module.module_actors import ModuleActors
from engine.enums.log_level import LogLevel
from engine.enums.log_source import LogSource
from engine.log.system_log_writer import SystemLogWriter
from engine.query.queries import Queries
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.drivers.support.driver_settings import MODULE_KEY
from core.modules.environments.models.environment import Environment
from core.modules.drivers.models.enums.bypass_mark_type import BypassMarkType
from core.modules.drivers.models.enums.bypass_mark_variant import BypassMarkVariant

HOOK_WORD = "hook"


class PanicWatch:
    """Watches the panic file the main agent writes when the journal does not answer: when it appears with a
    reason it shows a chat mark with that reason and logs it, and when it is removed it shows that the
    panic ended. It runs on a tick, since no hook comes while the file exists."""

    def __call__(self, container: Container) -> None:
        home, log = container.get(JournalHome), container.get(SystemLogWriter)
        bus, environments = container.get(Bus), tuple(container.get(Queries).query(Environment).all_rows())
        actor = container.get(ModuleActors).actor(MODULE_KEY)
        announced = home.panic_announced
        text = FileAccess.shared().read(home.panic_file, errors="replace") if home.panic_file.is_file() else ""
        reason = next((line.split(":", 1)[1].strip() for line in text.splitlines() if line.strip().startswith("why:")), "")
        if reason and not announced.is_file():
            FileAccess.shared().write(announced, reason)
            log.write(LogLevel.WARNING, f"panic file written: {text.strip()}", LogSource.BYPASS)
            self.show(bus, actor, environments, ShowMark(BypassMarkType.BYPASS, BypassMarkVariant.PANIC_STARTED, f"panic:{announced.stat().st_mtime_ns}", f"Panic: the main agent works around the journal. {reason}",
                             detail=text.strip(), outcome=MarkOutcome.FAILED))
        has_unresolved_panic = announced.is_file() and home.panic_file.is_file() and home.bypass_log.is_file()
        if has_unresolved_panic:
            claimed = home.bypass_log.with_suffix(".taken")
            home.bypass_log.replace(claimed)
            lines = [line for line in FileAccess.shared().read(claimed, errors="replace").splitlines() if line.strip()]
            claimed.unlink()
            if lines:
                log.write(LogLevel.WARNING, "\n".join(lines), LogSource.BYPASS)
                self.show(bus, actor, environments, ShowMark(BypassMarkType.BYPASS, BypassMarkVariant.UNCHECKED, f"panic-hooks:{claimed.parent.stat().st_mtime_ns}", f"{len(lines)} {HOOK_WORD}{'s' if len(lines) != 1 else ''} went through unchecked during the panic",
                                 outcome=MarkOutcome.FAILED, ended=True))
        if announced.is_file() and not home.panic_file.is_file():
            began = FileAccess.shared().read(announced)
            announced.unlink()
            home.panic_count.unlink(missing_ok=True)
            log.write(LogLevel.WARNING, "panic file removed", LogSource.BYPASS)
            self.show(bus, actor, environments, ShowMark(BypassMarkType.BYPASS, BypassMarkVariant.PANIC_ENDED, f"panic-ended:{home.folder.stat().st_mtime_ns}", f"The panic ended: the journal answers again. It began because: {began}",
                             outcome=MarkOutcome.PASSED, ended=True))

    @staticmethod
    def show(bus: Bus, actor: Actor, environments: tuple[Environment, ...], mark: ShowMark) -> None:
        for environment in environments:
            bus.run(mark, actor, environment_id=environment.id)
