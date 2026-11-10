import os
import sys
import tempfile
from collections.abc import Callable
from pathlib import Path

from engine.actor.actor import CORE_ACTOR_ID
from engine.change.event_log import EventLog
from engine.time.clock import Clock
from engine.container.container import Container
from core.base.database.database import Database
from engine.container.journal_container import sync_modules, synced_container
from engine.journal.journal_home import JournalHome
from core.base.registry.registry import Registry
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_runner import MoveRunner
from core.base.upgrade.upgrade_failed_error import UpgradeFailedError
from core.base.upgrade.upgrade_report import UpgradeReport
from core.base.upgrade.version_four_move import VersionFourMove
from install.backup_mismatch_error import BackupMismatchError
from install.backup_write_error import BackupWriteError
from install.code_replacement import CodeReplacement
from install.hook_switch import HookSwitch
from install.install_journal import InstallJournal
from install.restore_version_four import RestoreVersionFour
from install.stray_version_four_error import StrayVersionFourError
from install.server_wont_stop_error import ServerWontStopError
from engine.connection.unix_connection import UnixConnection
from install.upgrade_outcome import UpgradeOutcome
from install.upgrade_report_file import UpgradeReportFile
from install.upgrade_text import UpgradeText
from install.version_four_backup import BACKUP_FOLDER, DATABASE, VersionFourBackup
from install.version_four_files import VersionFourFiles
from core.base.serving.server_files import ServerFiles

DRY_RUN_LINE = "dry run: nothing was changed"
FINISHED_LINE = "nothing left to move"
UNCHANGED_LINE = "nothing was written"
FINISH_LINE = "run journal upgrade again to finish"
QUESTION = "move these rows into version 5? [y/N] "
RESTORE_QUESTION = "put version 4 back and set version 5 aside? [y/N] "
ACCEPTED_INPUTS = ("y", "yes")


class UpgradeJournal:
    """Moves a project's version 4 journal into version 5: refuses while a server answers or when there
    is no version 4 database, then, with the server's lock kept, backs the database up, syncs the version 5
    database, runs the moves of every module in order and tells what they did. A dry run runs them all and
    rolls them back; without confirmation it prints those counts and asks once."""

    def __init__(self, home: JournalHome, reply: Callable[[str], str] = input, source: Path | None = None) -> None:
        self.home, self.reply, self.source = home, reply, source
        self.ran = False

    def run(self, dry_run: bool = False, confirmed: bool = False) -> UpgradeOutcome:
        files = VersionFourFiles(self.home.folder)
        version_four = self.home.folder / DATABASE if (self.home.folder / DATABASE).is_file() else files.database()
        if not version_four.is_file():
            return UpgradeOutcome(1, f"no version 4 journal: {DATABASE} is not in {self.home.folder}")
        if self.has_answer():
            return UpgradeOutcome(1, f"a journal server answers in {self.home.folder}: stop it with journal server stop, then run the upgrade again")
        if not dry_run and not os.access(self.home.folder, os.W_OK):
            return UpgradeOutcome(1, f"{self.home.folder} cannot be written to: make it writable, then run the upgrade again; nothing was changed")
        lines: list[str] = []
        try:
            if dry_run or not confirmed:
                self.preview(version_four, lines)
            if not dry_run and (confirmed or self.agreed()):
                self.ran = True
                CodeReplacement(self.home).run([self.copy_code, lambda: self.upgrade(version_four, lines), self.sync_installed_modules])
        except UpgradeFailedError as error:
            return self.kept(UpgradeOutcome(1, "\n".join([*lines, str(error), *self.failure(error)])))
        except (BackupMismatchError, BackupWriteError, ServerWontStopError, StrayVersionFourError) as error:
            return UpgradeOutcome(1, "\n".join([*lines, str(error)]))
        return self.kept(UpgradeOutcome(0, "\n".join(lines)), dry_run)

    def failure(self, error: UpgradeFailedError) -> list[str]:
        standing = ", ".join(error.finished) or "nothing"
        return [f"failed: {error.module} ({error.reason})", f"rolled back: {error.module}", f"stayed moved: {standing}", FINISH_LINE]

    def kept(self, outcome: UpgradeOutcome, dry_run: bool = False) -> UpgradeOutcome:
        if self.should_save(outcome, dry_run):
            UpgradeReportFile(self.home.folder).save(outcome.text)
        return outcome

    def should_save(self, outcome: UpgradeOutcome, dry_run: bool) -> bool:
        return self.ran and not dry_run and outcome.text != FINISHED_LINE and self.home.folder.is_dir()

    def has_answer(self) -> bool:
        connection = UnixConnection(str(ServerFiles(self.home).socket), 5, "journal")
        try:
            connection.request("GET", "/health")
            return connection.getresponse().status == 200
        except OSError:
            return False
        finally:
            connection.close()

    def agreed(self) -> bool:
        return self.reply(QUESTION).strip().lower() in ACCEPTED_INPUTS

    def copy_code(self) -> None:
        if self.source is not None:
            InstallJournal(self.home.folder.parent, self.source).copy_code()

    def sync_installed_modules(self) -> None:
        if self.source is not None:
            InstallJournal(self.home.folder.parent, self.source).sync()

    def preview(self, version_four: Path, lines: list[str]) -> None:
        if self.home.database.exists():
            self.dry_run(self.home, version_four, lines)
            return
        with tempfile.TemporaryDirectory() as folder:
            home = JournalHome(Path(folder))
            sync_modules(home)
            self.dry_run(home, version_four, lines)

    def dry_run(self, home: JournalHome, version_four: Path, lines: list[str]) -> None:
        container = synced_container(home)
        try:
            if self.is_finished(container.get(Database), container.get(Registry)):
                lines.append(FINISHED_LINE)
                return
            text = UpgradeText(container.get(MoveRunner).run(version_four, dry_run=True))
            lines.extend([*text.table("what would move"), DRY_RUN_LINE, *text.lines(), UNCHANGED_LINE])
        finally:
            container.get(Database).close()

    def upgrade(self, version_four: Path, lines: list[str]) -> None:
        sync_modules(self.home)
        container = synced_container(self.home)
        try:
            finished = self.is_finished(container.get(Database), container.get(Registry))
            if finished and (self.home.folder / DATABASE).is_file():
                raise StrayVersionFourError(f"a version 4 journal.db is in {self.home.folder} again after the upgrade finished: another machine or session still ran "
                                            f"version 4 on this project. Its rows are not moved and the backup is kept as it is; stop version 4 there and move that "
                                            f"journal.db aside, or run journal upgrade --restore to go back to version 4. Nothing was changed")
            if not finished:
                backup = VersionFourBackup(self.home.folder).make()
                lines.extend([f"backup: {backup.path}", f"backup checked: {backup.tables} tables"])
                report = container.get(MoveRunner).run(version_four)
                text = UpgradeText(report)
                lines.extend([*text.table("what moved"), *text.lines()])
                self.finish(container, report, lines)
        finally:
            container.get(Database).close()
        retired = VersionFourFiles(self.home.folder).retire()
        if retired:
            lines.append(f"version 4's files moved into {self.home.folder / BACKUP_FOLDER}: {', '.join(retired)}")
        if not finished:
            lines.extend(HookSwitch(self.home.folder.parent).switch())
        lines.append(FINISHED_LINE if finished else "upgraded")

    def finish(self, container: Container, report: UpgradeReport, lines: list[str]) -> None:
        container.get(EventLog).write_upgrade_finished(CORE_ACTOR_ID, report.tables, "\n".join(lines), container.get(Clock).timestamp().text)

    def is_finished(self, database: Database, registry: Registry) -> bool:
        moved = MoveMap(database)
        return bool(registry.moves) and all(moved.finished(entry.module, entry.path.checked_class(VersionFourMove).name) is not None for entry in registry.moves)


if __name__ == "__main__":
    flags, journal = sys.argv[2:], JournalHome(Path(sys.argv[1]) / ".journal")
    if "--restore" in flags:
        agreed = "--yes" in flags or input(RESTORE_QUESTION).strip().lower() in ACCEPTED_INPUTS
        outcome = RestoreVersionFour(journal).run() if agreed else UpgradeOutcome(0, UNCHANGED_LINE)
    else:
        outcome = UpgradeJournal(journal, source=Path(__file__).resolve().parents[1]).run("--dry-run" in flags, "--yes" in flags)
    print(outcome.text)
    sys.exit(outcome.code)
