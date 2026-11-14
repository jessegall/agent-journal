from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.row.page import Page
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.developer.support.system_log import SystemLog
from core.modules.developer.support.log_filter import LogFilter
from engine.enums.log_level import LogLevel
from core.modules.developer.support.log_line import LogLine
from engine.enums.log_source import LogSource


class SystemLogsSubcommand(ReadSubcommand[Page[LogLine]]):
    """Reads one page of system log lines, newest first."""

    cli_name = "developer"
    name = "system-logs"

    def __init__(self, log: SystemLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--source", action="append", type=LogSource, choices=list(LogSource), default=[])
        parser.add_argument("--level", action="append", type=LogLevel, choices=list(LogLevel), default=[])
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=50)

    def read(self, arguments: Namespace, caller: Caller) -> Page[LogLine]:
        return self.log.page(LogFilter(tuple(arguments.source), tuple(arguments.level)), arguments.page, arguments.limit)
