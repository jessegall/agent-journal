from collections.abc import Generator
from contextlib import contextmanager

from core.base.database.repeated_lines import RepeatedLines
from core.base.database.collecting_repeated_work import CollectingRepeatedWork
from core.base.database.database import Database
from core.base.database.repeated_calls_error import RepeatedCallsError
from core.base.database.repeated_finding import RepeatedFinding
from core.base.database.reported_findings import ReportedFindings
from core.base.database.request_watch import RequestWatch
from core.base.error_log import ErrorLog
from core.base.registry.lazy_loading import LazyLoading
from core.modules.developer.support.developer_settings import PREVENT_LAZY_LOADING_SETTING, REPEATED_WORK_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues


class ReportingRequestWatch(RequestWatch):
    """With the setting on, counts the database work of one request as the stories do, never raising in the
    middle of it, and when the request ends reports each finding not reported before as an error, which shows
    in the chat and reaches the main agent. It also turns the stop on lazy loads on or off for the request."""

    def __init__(self, settings: SettingValues, database: Database, errors: ErrorLog, reported: ReportedFindings) -> None:
        self.settings, self.database, self.errors, self.reported = settings, database, errors, reported

    @contextmanager
    def watching(self, argv: list[str]) -> Generator[None]:
        LazyLoading.prevented = self.settings.project.flag(PREVENT_LAZY_LOADING_SETTING)
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

    def report_repeated_lines(self, repeated: RepeatedLines) -> None:
        if not self.settings.project.flag(REPEATED_WORK_SETTING):
            return
        text = f"the window {repeated.window} sent {repeated.count} lines of {repeated.line} in a short time, each for another id: it should read them in one line"
        self.report([repeated.window], [RepeatedFinding(f"viewer lines {repeated.window} {repeated.line}", text)])

    def report(self, argv: list[str], findings: list[RepeatedFinding]) -> None:
        for finding in self.reported.unreported(findings):
            self.errors.reported(argv, RepeatedCallsError(finding.text))
