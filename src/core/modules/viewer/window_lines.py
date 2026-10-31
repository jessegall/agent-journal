from core.base.actor import Actor
from core.base.cli.line_parser import LineParser
from core.base.cli.parsed_line import ParsedLine
from core.base.cli.usage_error import UsageError
from core.base.cli.write_flags import WriteFlags
from core.base.registry.registry import Registry
from core.modules.viewer.window_refusal import WindowRefusal


class WindowLines:
    """Whether a window may run a command line for a person: the line parses, it is a read subcommand the window
    declares or a command it declares, it neither skips a guard nor names another environment, and the person has
    allowed it unless the journal ships the window. It checks the parsed line, never its raw words."""

    def __init__(self, registry: Registry, line_parser: LineParser, flags: WriteFlags) -> None:
        self.registry, self.line_parser, self.flags = registry, line_parser, flags

    def check(self, window_name: str, argv: list[str], person: Actor, environment: str) -> None:
        if not self.registry.has_window(window_name):
            raise WindowRefusal(f"no installed module declares the window {window_name}")
        window = self.registry.window(window_name)
        parsed = self.parsed(window_name, argv)
        skips_guard = not parsed.is_read and bool(self.flags.skipped_guards(parsed.arguments))
        if skips_guard or getattr(parsed.arguments, "environment", None) not in (None, environment):
            raise WindowRefusal(f"{window_name} may not skip a guard or name another environment")
        declared = window.reads if parsed.is_read else window.runs
        if parsed.line not in declared:
            raise WindowRefusal(f"{window_name} does not declare {parsed.line}")
        if not window.shipped:
            raise WindowRefusal(f"{window_name} may run {parsed.line} once you allow it")

    def parsed(self, window_name: str, argv: list[str]) -> ParsedLine:
        if len(argv) < 2:
            raise UsageError(f"{window_name} sent no command line")
        subcommand, parser = self.line_parser.parser(argv)
        try:
            return ParsedLine(subcommand, parser.parse_args(argv[2:]))
        except SystemExit as exit_request:
            raise UsageError(f"{window_name} sent a line that does not parse: {' '.join(argv)}") from exit_request
