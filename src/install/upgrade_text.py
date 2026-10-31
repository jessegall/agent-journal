from core.base.upgrade.upgrade_report import UpgradeReport

WAITING_TABLES = ("triggers", "checks", "dumps",
                  "plugins", "suggestions", "aliases",
                  "collections", "library_items", "mcp_servers", "reactions", "release_messages", "scheduled_jobs", "secrets", "statistics", "test_turns")
BOOKKEEPING_TABLES = ("entries", "state_transitions", "migrations", "migrated_rows", "version3_migrations", "journal_versions", "timings", "dashboard_rows")
BOOKKEEPING_NOTE = "version 4's own records, kept in the backup"
WAITING_NOTE = "waits for its module and stays in the backup"
HEADER = "module  rows  left behind"
UNCLAIMED_HEADING = "tables no module claims"
CLEAN_CELL = "nothing"


class UpgradeText:
    """The lines that tell what an upgrade moved: a plain table of each module's rows and what it left behind and
    of the tables no module claims, then the detail of every module, skipped row and note."""

    def __init__(self, report: UpgradeReport) -> None:
        self.report = report

    def table(self, heading: str) -> list[str]:
        modules = [f"{module}  {rows}  {self.leftovers(module)}" for module, rows in self.report.moved.items()]
        unclaimed = [f"{table}  {rows} rows" for table, rows in self.report.unclaimed.items()]
        return [heading, HEADER, *modules, UNCLAIMED_HEADING, *unclaimed]

    def leftovers(self, module: str) -> str:
        tables = [f"{table}: {rows} rows" for table, rows in self.report.module_tables.get(module, {}).items()]
        return "; ".join(tables) or CLEAN_CELL

    @staticmethod
    def unclaimed_note(table: str) -> str:
        if table in WAITING_TABLES:
            return f"; {WAITING_NOTE}"
        return f"; {BOOKKEEPING_NOTE}" if table in BOOKKEEPING_TABLES else ""

    def lines(self) -> list[str]:
        modules = [f"{module}: moved {rows}, already moved {self.report.repeated.get(module, 0)}" for module, rows in self.report.moved.items()]
        dropped = [f"dropped {table}: {rows} rows" for table, rows in self.report.dropped_tables.items()]
        unclaimed = [f"not claimed: {table} ({rows} rows){self.unclaimed_note(table)}" for table, rows in self.report.unclaimed.items()]
        return [*modules, *self.report.skipped, *self.report.notes, *dropped, *unclaimed]
