from pathlib import Path

from engine.command.bus import Bus
from engine.container.container import Container
from engine.enums.log_level import LogLevel
from engine.enums.mark_outcome import MarkOutcome
from engine.errors.refusal import Refusal
from engine.log.system_log_writer import SystemLogWriter
from engine.module.helper_type_check import AGENTS_MODULE
from engine.module.module_actors import ModuleActors
from engine.provider.program_settings_sync import ProgramSettingsSync
from engine.query.queries import Queries
from core.modules.agents.models.enums.program_settings_mark_type import ProgramSettingsMarkType
from core.modules.agents.models.enums.program_settings_mark_variant import ProgramSettingsMarkVariant
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.environments.models.environment import Environment


class ProgramSettingsTick:
    """Writes the journal's own settings files of each agent program: at server start after backing up the
    person's own files, and on every later tick only the journal's files, so a tick never fills the backups. A
    failure is logged, never raised, and a person's settings file it cannot read or parse is shown once in the chat."""

    def __init__(self) -> None:
        self.has_prepared = False
        self.shown_unreadable: tuple[Path, ...] = ()
        self.shown_held: tuple[str, ...] = ()

    def __call__(self, container: Container) -> None:
        sync = container.get(ProgramSettingsSync)
        try:
            self.update(sync)
        except Refusal as refusal:
            container.get(SystemLogWriter).write(LogLevel.WARNING, refusal.reason)
        unreadable = sync.unreadable_person_files()
        if unreadable != self.shown_unreadable:
            self.shown_unreadable = unreadable
            for path in unreadable:
                self.show(container, ShowMark(ProgramSettingsMarkType.PROGRAM_SETTINGS, ProgramSettingsMarkVariant.UNREADABLE_PERSON_FILE,
                                              f"unreadable-person-file:{path}:{path.stat().st_mtime_ns}",
                                              f"Your settings file {path} could not be read, so the journal carries none of its settings into its own",
                                              outcome=MarkOutcome.FAILED))
        held = sync.held_cleanups()
        if held != self.shown_held:
            self.show_held(container, held or self.shown_held, ended=not held)
            self.shown_held = held

    def update(self, sync: ProgramSettingsSync) -> None:
        if self.has_prepared:
            sync.write_all()
            return
        sync.prepare_all()
        self.has_prepared = True

    def show_held(self, container: Container, programs: tuple[str, ...], ended: bool) -> None:
        names = ", ".join(programs)
        text = (f"The journal took its old hooks out of the project files of {names}" if ended else
                f"The journal keeps its old hooks in the project files of {names} until the sessions started before the switch end")
        self.show(container, ShowMark(ProgramSettingsMarkType.PROGRAM_SETTINGS, ProgramSettingsMarkVariant.HELD_PROJECT_HOOKS, f"held-project-hooks:{names}",
                                      text, ended=ended))

    @staticmethod
    def show(container: Container, mark: ShowMark) -> None:
        bus, actor = container.get(Bus), container.get(ModuleActors).actor(AGENTS_MODULE)
        for environment in container.get(Queries).query(Environment).all_rows():
            bus.run(mark, actor, environment_id=environment.id)
