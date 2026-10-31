from collections.abc import Callable
from contextlib import AbstractContextManager
from pathlib import Path

from core.base.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from core.base.clock import Clock
from core.base.database.database import Database
from core.base.journal_home import JournalHome
from core.base.registry.move_entry import MoveEntry
from core.base.registry.setting_entry import GROUP_TYPE
from core.base.registry.registry import Registry
from core.base.upgrade.dry_run_end_error import DryRunEndError
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.upgrade_failed_error import UpgradeFailedError
from core.base.upgrade.upgrade_report import UpgradeReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource


class MoveRunner:
    """Runs the registered moves from a version 4 database in module order, each in one transaction with its
    finished row, skips a move already finished, and gathers what they did. A dry run rolls every move back,
    so the counts are real and nothing stays; a move that raises is rolled back and the moves before it stay."""

    def __init__(self, registry: Registry, database: Database, clock: Clock, events: EventLog, home: JournalHome) -> None:
        self.registry, self.database, self.clock, self.events, self.home = registry, database, clock, events, home

    def run(self, version_four: Path, dry_run: bool = False) -> UpgradeReport:
        report, moved = UpgradeReport(), MoveMap(self.database)
        context = MoveContext(CORE_ACTOR_ID, self.clock.timestamp().text, str(self.home.project_folder),
                              tuple(entry.key for entry in self.registry.settings if entry.type != GROUP_TYPE),
                              {mark.type: mark.variants[0] for mark in self.registry.marks if mark.variants}, str(self.home.folder))
        with VersionFourSource(version_four) as source:
            try:
                if dry_run:
                    self.run_dry(source, moved, context, report)
                else:
                    self.run_each(source, moved, context, report, lambda module: self.database.transaction())
            except DryRunEndError:
                pass
            report.unclaimed = {table: source.count(table) for table in source.tables() if table not in self.claimed()}
        return report

    def run_dry(self, source: VersionFourSource, moved: MoveMap, context: MoveContext, report: UpgradeReport) -> None:
        with self.database.transaction():
            self.run_each(source, moved, context, report, self.database.savepoint)
            raise DryRunEndError()

    def run_each(self, source: VersionFourSource, moved: MoveMap, context: MoveContext, report: UpgradeReport, scope: Callable[[str], AbstractContextManager[None]]) -> None:
        for entry in self.registry.moves:
            self.run_move(entry, source, moved, context, report, scope)

    def run_move(self, entry: MoveEntry, source: VersionFourSource, moved: MoveMap, context: MoveContext, report: UpgradeReport,
                 scope: Callable[[str], AbstractContextManager[None]]) -> None:
        move = entry.path.checked_class(VersionFourMove)()
        stored = moved.finished(entry.module, move.name)
        if stored is not None:
            report.moved[entry.module], report.repeated[entry.module] = 0, sum(stored["moved"].values()) + sum(stored["repeated"].values())
            report.dropped[entry.module] = sum(stored["dropped"].values())
            self.add_dropped(report, entry.module, stored["dropped"])
            return
        outcome = self.transaction(entry, move, source, moved, context, scope)
        report.moved[entry.module], report.repeated[entry.module] = sum(outcome.moved.values()), sum(outcome.repeated.values())
        report.dropped[entry.module] = sum(outcome.dropped.values())
        self.add_dropped(report, entry.module, outcome.dropped)
        for table, rows in outcome.moved.items():
            report.tables[table] = report.tables.get(table, 0) + rows
        report.skipped.extend(outcome.skipped)
        report.notes.extend(outcome.notes)

    def add_dropped(self, report: UpgradeReport, module: str, tables: dict[str, int]) -> None:
        report.module_tables[module] = dict(tables)
        for table, rows in tables.items():
            report.dropped_tables[table] = report.dropped_tables.get(table, 0) + rows

    def transaction(self, entry: MoveEntry, move: VersionFourMove, source: VersionFourSource, moved: MoveMap, context: MoveContext,
                    scope: Callable[[str], AbstractContextManager[None]]) -> MoveReport:
        outcome = MoveReport()
        try:
            with scope(entry.module):
                outcome = move.move(source, self.database, moved, context)
                counts = {"moved": outcome.moved, "repeated": outcome.repeated, "dropped": outcome.dropped}
                moved.finish(entry.module, move.name, counts)
                self.events.write_upgrade_moved(CORE_ACTOR_ID, entry.module, counts, context.timestamp)
        except Exception as error:
            raise UpgradeFailedError(f"the move of {entry.module} failed: {error}", entry.module, str(error), tuple(self.finished_modules())) from error
        return outcome

    def finished_modules(self) -> list[str]:
        moved = MoveMap(self.database)
        return [entry.module for entry in self.registry.moves if moved.finished(entry.module, entry.path.checked_class(VersionFourMove).name) is not None]

    def claimed(self) -> set[str]:
        return {table for entry in self.registry.moves for table in (*entry.reads, *entry.drops)}
