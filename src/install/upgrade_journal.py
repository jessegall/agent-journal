import os
import sys
import tempfile
from collections.abc import Callable
from pathlib import Path

from core.base.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from core.base.clock import Clock
from core.base.container import Container
from core.base.database.database import Database
from core.base.journal_container import opened_container, synced_container
from core.base.journal_home import JournalHome
from core.base.module.module_sync import ModuleSync
from core.base.registry.registry import Registry
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_runner import MoveRunner
from core.base.upgrade.upgrade_failed import UpgradeFailed
from core.base.upgrade.upgrade_report import UpgradeReport
from core.base.upgrade.version_four_move import VersionFourMove
from install.backup_mismatch import BackupMismatch
from install.code_replacement import CodeReplacement
from install.install_journal import InstallJournal
from install.restore_version_four import RestoreVersionFour
from install.server_wont_stop import ServerWontStop
from install.unix_connection import UnixConnection
from install.upgrade_outcome import UpgradeOutcome
from install.upgrade_report_file import UpgradeReportFile
from install.upgrade_text import UpgradeText
from install.version_four_backup import BACKUP_FOLDER, DATABASE, VersionFourBackup
from install.version_four_files import VersionFourFiles
from server.server_files import ServerFiles

DRY_RUN_LINE = "dry run: nothing was changed"
FINISHED_LINE = "nothing left to move"
UNCHANGED_LINE = "nothing was written"
FINISH_LINE = "run journal upgrade again to finish"
QUESTION = "move these rows into version 5? [y/N] "
AGREEMENTS = ("y", "yes")


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
                CodeReplacement(self.home).run([self.copy_code, lambda: self.upgrade(version_four, lines)])
        except UpgradeFailed as error:
            return self.kept(UpgradeOutcome(1, "\n".join([*lines, str(error), *self.failure(error)])))
        except (BackupMismatch, ServerWontStop) as error:
            return UpgradeOutcome(1, "\n".join([*lines, str(error)]))
        return self.kept(UpgradeOutcome(0, "\n".join(lines)), dry_run)

    def failure(self, error: UpgradeFailed) -> list[str]:
        standing = ", ".join(error.finished) or "nothing"
        return [f"failed: {error.module} ({error.reason})", f"rolled back: {error.module}", f"stayed moved: {standing}", FINISH_LINE]

    def kept(self, outcome: UpgradeOutcome, dry_run: bool = False) -> UpgradeOutcome:
        if self.is_worth_saving(outcome, dry_run):
            UpgradeReportFile(self.home.folder).save(outcome.text)
        return outcome

    def is_worth_saving(self, outcome: UpgradeOutcome, dry_run: bool) -> bool:
        return self.ran and not dry_run and outcome.text != FINISHED_LINE and self.home.folder.is_dir()

    def has_answer(self) -> bool:
        connection = UnixConnection(str(ServerFiles(self.home).socket))
        try:
            connection.request("GET", "/health")
            return connection.getresponse().status == 200
        except OSError:
            return False
        finally:
            connection.close()

    def agreed(self) -> bool:
        return self.reply(QUESTION).strip().lower() in AGREEMENTS

    def copy_code(self) -> None:
        if self.source is not None:
            InstallJournal(self.home.folder.parent, self.source).copy_code()

    def preview(self, version_four: Path, lines: list[str]) -> None:
        if self.home.database.exists():
            self.rehearse(self.home, version_four, lines)
            return
        with tempfile.TemporaryDirectory() as folder:
            home = JournalHome(Path(folder))
            self.sync(home)
            self.rehearse(home, version_four, lines)

    def rehearse(self, home: JournalHome, version_four: Path, lines: list[str]) -> None:
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
        self.sync(self.home)
        container = synced_container(self.home)
        try:
            finished = self.is_finished(container.get(Database), container.get(Registry))
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
        lines.append(FINISHED_LINE if finished else "upgraded")

    def finish(self, container: Container, report: UpgradeReport, lines: list[str]) -> None:
        container.get(EventLog).write_upgrade_finished(CORE_ACTOR_ID, report.tables, "\n".join(lines), container.get(Clock).timestamp().text)

    def sync(self, home: JournalHome) -> None:
        container = opened_container(home)
        try:
            container.get(ModuleSync).run()
        finally:
            container.get(Database).close()

    def is_finished(self, database: Database, registry: Registry) -> bool:
        moved = MoveMap(database)
        return bool(registry.moves) and all(moved.finished(entry.module, entry.path.checked_class(VersionFourMove).name) is not None for entry in registry.moves)


if __name__ == "__main__":
    flags, journal = sys.argv[2:], JournalHome(Path(sys.argv[1]) / ".journal")
    if "--restore" in flags:
        outcome = RestoreVersionFour(journal).run()
    else:
        outcome = UpgradeJournal(journal, source=Path(__file__).resolve().parents[1]).run("--dry-run" in flags, "--yes" in flags)
    print(outcome.text)
    sys.exit(outcome.code)
