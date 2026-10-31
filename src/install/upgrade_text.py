from core.base.upgrade.upgrade_report import UpgradeReport

WAITING_TABLES = ("workers", "reviewers", "verifiers", "questions", "sequences", "templates", "triggers", "checks", "dumps", "notices", "docs", "reports",
                  "comments", "links", "phones", "shares", "plugins", "suggestions", "skills")
WAITING_NOTE = "waits for its module and stays in the backup"


class UpgradeText:
    """The lines that tell what an upgrade moved, module by module, which version 4 tables were knowingly left and
    which no module claims."""

    def __init__(self, report: UpgradeReport) -> None:
        self.report = report

    def lines(self) -> list[str]:
        modules = [f"{module}: moved {rows}, already moved {self.report.repeated.get(module, 0)}" for module, rows in self.report.moved.items()]
        dropped = [f"dropped {table}: {rows} rows" for table, rows in self.report.dropped_tables.items()]
        unclaimed = [f"not claimed: {table} ({rows} rows)" + (f"; {WAITING_NOTE}" if table in WAITING_TABLES else "") for table, rows in self.report.unclaimed.items()]
        return [*modules, *self.report.skipped, *self.report.notes, *dropped, *unclaimed]
