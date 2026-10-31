from core.base.upgrade.upgrade_report import UpgradeReport

WAITING_TABLES = ("sequences", "templates", "triggers", "checks", "dumps", "notices", "docs", "reports",
                  "comments", "links", "phones", "shares", "plugins", "suggestions")
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

    def lines(self) -> list[str]:
        modules = [f"{module}: moved {rows}, already moved {self.report.repeated.get(module, 0)}" for module, rows in self.report.moved.items()]
        dropped = [f"dropped {table}: {rows} rows" for table, rows in self.report.dropped_tables.items()]
        unclaimed = [f"not claimed: {table} ({rows} rows)" + (f"; {WAITING_NOTE}" if table in WAITING_TABLES else "") for table, rows in self.report.unclaimed.items()]
        return [*modules, *self.report.skipped, *self.report.notes, *dropped, *unclaimed]
