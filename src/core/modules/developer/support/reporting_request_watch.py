from collections.abc import Generator
from contextlib import contextmanager

from engine.database.repeated_lines import RepeatedLines
from engine.database.collecting_repeated_work import CollectingRepeatedWork
from engine.database.database import READ_LIMIT_ROWS, Database
from engine.database.repeated_calls_error import RepeatedCallsError
from engine.database.repeated_finding import RepeatedFinding
from engine.database.reported_findings import ReportedFindings
from engine.database.request_watch import RequestWatch
from engine.log.error_log import ErrorLog
from engine.errors.read_limit_error import ReadLimitError
from engine.registry.lazy_loading import LazyLoading
from core.modules.developer.support.developer_settings import PREVENT_LAZY_LOADING_SETTING, READ_LIMIT_SETTING, REPEATED_WORK_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues


class ReportingRequestWatch(RequestWatch):
    """With the setting on, counts the database work of one request as the stories do, never raising in the
    middle of it, and when the request ends reports each finding not reported before as an error, which shows
    in the chat and reaches the main agent. It also turns the stop on lazy loads and the
    limit on the rows of one read on or off for the request, and reports each read over the limit that the
    request collected in place of raising it."""

    def __init__(self, settings: SettingValues, database: Database, errors: ErrorLog, reported: ReportedFindings) -> None:
        self.settings, self.database, self.errors, self.reported = settings, database, errors, reported

    @contextmanager
    def watching(self, argv: list[str]) -> Generator[None]:
        LazyLoading.prevented = self.settings.project.flag(PREVENT_LAZY_LOADING_SETTING)
        self.database.read_limit_rows = READ_LIMIT_ROWS if self.settings.project.flag(READ_LIMIT_SETTING) else None
        try:
            with self.counting(argv):
                yield
        finally:
            self.report_large_reads(argv)

    @contextmanager
    def watching_without_refusal(self, argv: list[str]) -> Generator[None]:
        self.database.collected_large_reads = []
        with self.watching(argv):
            yield

    @contextmanager
    def counting(self, argv: list[str]) -> Generator[None]:
        if not self.settings.project.flag(REPEATED_WORK_SETTING):
            yield
            return
        original, work = self.database.repeated_work, CollectingRepeatedWork(self.database)
        start_points = original.points()
        work.add(start_points)
        self.database.repeated_work = work
        try:
            with work.request():
                yield
        finally:
            self.database.repeated_work = original
            original.add(work.points().minus(start_points))
            self.report(argv, work.findings)

    def report_large_reads(self, argv: list[str]) -> None:
        large_reads, self.database.collected_large_reads = self.database.collected_large_reads or [], None
        for finding in self.reported.unreported([RepeatedFinding(f"large read {error}", str(error)) for error in large_reads]):
            self.errors.reported(argv, ReadLimitError(finding.text))

    def report_repeated_lines(self, repeated: RepeatedLines) -> None:
        if not self.settings.project.flag(REPEATED_WORK_SETTING):
            return
        text = f"the window {repeated.window} sent {repeated.count} lines of {repeated.line} in a short time, each for another id: it should read them in one line"
        self.report([repeated.window], [RepeatedFinding(f"viewer lines {repeated.window} {repeated.line}", text)])

    def report(self, argv: list[str], findings: list[RepeatedFinding]) -> None:
        for finding in self.reported.unreported(findings):
            self.errors.reported(argv, RepeatedCallsError(finding.text))
