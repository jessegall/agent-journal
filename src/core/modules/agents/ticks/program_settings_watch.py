import hashlib
import stat
from pathlib import Path

from engine.command.bus import Bus
from engine.container.container import Container
from engine.enums.log_level import LogLevel
from engine.enums.mark_outcome import MarkOutcome
from engine.errors.refusal import Refusal
from engine.file.file_access import FileAccess
from engine.file.kept_bytes import KeptBytes
from engine.log.system_log_writer import SystemLogWriter
from engine.module.helper_type_check import AGENTS_MODULE
from engine.module.module_actors import ModuleActors
from engine.provider.program_settings import ProgramSettings
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.provider.program_settings_sync import ProgramSettingsSync
from engine.provider.program_settings_writer import ProgramSettingsWriter
from engine.provider.providers import Providers
from engine.query.queries import Queries
from core.modules.agents.models.enums.program_settings_mark_type import ProgramSettingsMarkType
from core.modules.agents.models.enums.program_settings_mark_variant import ProgramSettingsMarkVariant
from core.modules.agents.support.outside_change import OutsideChange
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.environments.models.environment import Environment


SWITCH_KEY = "program-settings-switch"
SWITCH_TEXT = ("The journal now starts Claude Code and Codex on its own settings in .journal/programs, written again at every start; "
               "your own settings files are backed up in .journal/backups/program-settings and left as they are.")


class ProgramSettingsWatch:
    """Keeps the journal's own settings files of each agent program as the journal writes them: at
    server start it backs up the person's own files first, and on every tick it puts back a file or
    link changed outside the journal, keeps the changed bytes as a rejected copy and shows one chat
    mark for each change. A Codex login the program refreshed by putting a new file in place of its
    link is moved to the person's folder and linked again. A failure is logged, never raised, and a
    person's settings file it cannot read or parse is shown once in the chat."""

    def __init__(self) -> None:
        self.has_prepared = False
        self.shown_unreadable: tuple[Path, ...] = ()
        self.shown_waiting: tuple[str, ...] = ()

    def __call__(self, container: Container) -> None:
        sync, log = container.get(ProgramSettingsSync), container.get(SystemLogWriter)
        for provider in container.get(Providers).all():
            try:
                self.watched(container, sync, provider.name)
            except (OSError, Refusal) as error:
                log.write(LogLevel.WARNING, f"the journal's {provider.title} settings could not be put back: {error}")
        if not self.has_prepared:
            self.show(container, ShowMark(ProgramSettingsMarkType.PROGRAM_SETTINGS, ProgramSettingsMarkVariant.PROGRAM_SWITCH, SWITCH_KEY, SWITCH_TEXT))
        self.has_prepared = True
        self.show_person_files(container, sync)

    def watched(self, container: Container, sync: ProgramSettingsSync, program: str) -> None:
        settings = sync.settings(program)
        title = container.get(Providers).provider(program).title
        changes = self.external_changes(container, settings, title)
        self.keep_replaced_links(settings)
        if self.has_prepared:
            sync.write(program)
        else:
            sync.prepare(program)
        for change in changes:
            container.get(SystemLogWriter).write(LogLevel.WARNING, change.text)
            self.show(container, ShowMark(ProgramSettingsMarkType.PROGRAM_SETTINGS, ProgramSettingsMarkVariant.RESTORED, change.key, change.text,
                                          outcome=MarkOutcome.FAILED))

    def link_was_put_back(self, path: Path) -> bool:
        return path.is_symlink() or (self.has_prepared and not path.exists())

    def external_changes(self, container: Container, settings: ProgramSettings, title: str) -> list[OutsideChange]:
        writer, backup = container.get(ProgramSettingsWriter), container.get(ProgramSettingsBackup)
        recorded = writer.recorded_digests()
        files = {file.path: file for file in settings.files}
        changes: list[OutsideChange] = []
        restored_notice = f"The journal's {title} settings were changed outside the journal and were put back"
        for path in writer.differences(settings):
            if path in settings.links:
                if self.link_was_put_back(path):
                    changes.append(OutsideChange(f"put-back:{path}:link", f"{restored_notice}: the link {path} was made again."))
                continue
            if not path.is_file():
                if str(path) not in recorded:
                    continue
                changes.append(OutsideChange(f"put-back:{path}:deleted", f"{restored_notice}: {path} was deleted and is written again."))
                continue
            data = KeptBytes.read(path)
            digest = hashlib.sha256(data).hexdigest()
            if recorded.get(str(path)) == digest:
                if stat.S_IMODE(path.stat().st_mode) != files[path].mode:
                    changes.append(OutsideChange(f"put-back:{path}:mode:{digest}", f"{restored_notice}: {path} was made writable and is read-only again."))
                continue
            copy = backup.rejected(settings.program, path, data)
            changes.append(OutsideChange(f"put-back:{path}:{digest}", f"{restored_notice}. The changed copy is kept at {copy}."))
        return changes

    @staticmethod
    def keep_replaced_links(settings: ProgramSettings) -> None:
        for link, target in settings.links.items():
            if link.is_symlink() or not link.is_file():
                continue
            if target.exists() and target.stat().st_mtime_ns > link.stat().st_mtime_ns:
                continue
            FileAccess.shared().replace(link, target)

    def show_person_files(self, container: Container, sync: ProgramSettingsSync) -> None:
        unreadable = sync.unreadable_person_files()
        if unreadable != self.shown_unreadable:
            self.shown_unreadable = unreadable
            for path in unreadable:
                self.show(container, ShowMark(ProgramSettingsMarkType.PROGRAM_SETTINGS, ProgramSettingsMarkVariant.UNREADABLE_PERSON_FILE,
                                              f"unreadable-person-file:{path}:{path.stat().st_mtime_ns}",
                                              f"Your settings file {path} could not be read, so the journal carries none of its settings into its own",
                                              outcome=MarkOutcome.FAILED))
        waiting_cleanups = sync.held_cleanups()
        if waiting_cleanups != self.shown_waiting:
            self.show_waiting_cleanups(container, waiting_cleanups or self.shown_waiting, ended=not waiting_cleanups)
            self.shown_waiting = waiting_cleanups

    def show_waiting_cleanups(self, container: Container, programs: tuple[str, ...], ended: bool) -> None:
        names = ", ".join(programs)
        text = (f"The journal took its old hooks out of the project files of {names}" if ended else
                f"The journal keeps its old hooks in the project files of {names} until the sessions started before the switch end")
        self.show(container, ShowMark(ProgramSettingsMarkType.PROGRAM_SETTINGS, ProgramSettingsMarkVariant.PROJECT_HOOKS_WAITING, f"held-project-hooks:{names}",
                                      text, ended=ended))

    @staticmethod
    def show(container: Container, mark: ShowMark) -> None:
        bus, actor = container.get(Bus), container.get(ModuleActors).actor(AGENTS_MODULE)
        for environment in container.get(Queries).query(Environment).all_rows():
            bus.run(mark, actor, environment_id=environment.id)
