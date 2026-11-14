from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.execution_source import ExecutionSource
from engine.enums.starter_type import StarterType
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.classes.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.models.request_run import RequestRun

PREVIEW_COUNT = 5
RECENT_ROWS = 500
RECENT_REASON = "a preview looks through the newest runs for the lines a class would match"
PREVIEW_STARTER = ExecutionStarter(StarterType.PERSON)


class ExecutionClassPreview:
    """The newest lines a class of a line pattern or a plugin would have matched, from the recent runs and the runs
    of the journal's own, matched as the class table matches them so the preview and the class agree."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def matched(self, line_pattern: str, plugin: str) -> list[str]:
        candidate = ExecutionClass("preview", ExecutionLane.LONG, 1, ExecutionPriority.NORMAL, line_pattern=line_pattern, plugin=plugin)
        processes = self.queries.query(Process).newest().limit(RECENT_ROWS, RECENT_REASON).get()
        runs = self.queries.query(RequestRun).newest().limit(RECENT_ROWS, RECENT_REASON).get()
        timed = [(process.creation_timestamp().text, process.line, process.plugin) for process in processes] + [(run.ended_at.text, run.line, "") for run in runs]
        newest_first = sorted(timed, key=lambda entry: entry[0], reverse=True)
        lines = [line for _, line, run_plugin in newest_first
                 if ExecutionClasses.is_person_match(candidate, ExecutionSubject(ExecutionSource.SHELL_LINE, PREVIEW_STARTER, line=line, plugin_name=run_plugin))]
        return list(dict.fromkeys(lines))[:PREVIEW_COUNT]
