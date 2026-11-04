from core.base.actor import Actor
from core.base.cli.line_parser import LineParser
from core.base.cli.parsed_line import ParsedLine
from core.base.cli.usage_error import UsageError
from core.base.cli.write_flags import WriteFlags
from core.base.environment_names import EnvironmentNames
from core.base.registry.registry import Registry
from core.modules.viewer.commands.support.window_allowances import WindowAllowances
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType
from core.modules.viewer.commands.support.window_refusal import WindowRefusal

WINDOW_SETTING_LINES = ("window save-setting", "window setting")
WINDOW_SEARCH_LINE = "window search"
PERSON_LINES = ("window allow", "window trust", "setting make", "setting edit", "setting delete", "viewer-layout save")


class WindowLines:
    """Whether a window may run a command line for a person: the line parses, it is a read subcommand the
    window declares or a command it declares, or one of its own settings, it neither skips a guard nor names
    another environment, and the person has allowed it unless the journal ships the window. A line only a
    button allows answers to the module of that button, not the window. It checks the parsed line, never its
    raw words."""

    def __init__(self, registry: Registry, line_parser: LineParser, flags: WriteFlags, allowances: WindowAllowances, environment_names: EnvironmentNames) -> None:
        self.registry, self.line_parser, self.flags = registry, line_parser, flags
        self.allowances, self.environment_names = allowances, environment_names

    def check(self, window_name: str, argv: list[str], person: Actor, environment: str) -> None:
        dock = self.registry.dock(window_name)
        if dock is not None and not self.registry.has_window(window_name):
            if " ".join(argv[:2]) not in dock.reads:
                raise WindowRefusal(f"the dock {window_name} does not declare {' '.join(argv[:2])}")
            parsed = self.parsed(window_name, argv)
            if not dock.shipped and parsed.line not in self.allowances.allowed_lines(person.id, self.environment_names.environment_id(environment), window_name, WindowPermissionType.READS):
                raise WindowRefusal(f"{window_name} may run {parsed.line} once you allow it")
            return
        if not self.registry.has_window(window_name):
            raise WindowRefusal(f"no installed module declares the window {window_name}")
        window = self.registry.window(window_name)
        subcommand_name = " ".join(argv[:2])
        if not window.shipped and subcommand_name in PERSON_LINES:
            raise WindowRefusal(f"{window_name} may never run {subcommand_name}: only a person gives rights and changes settings")
        parsed = self.parsed(window_name, argv)
        skips_guard = not parsed.is_read and bool(self.flags.skipped_guards(parsed.arguments))
        labelled_id = getattr(parsed.arguments, "environment_id", None)
        if skips_guard or getattr(parsed.arguments, "environment", None) not in (None, environment) or (labelled_id is not None and labelled_id != self.environment_names.environment_id(environment)):
            raise WindowRefusal(f"{window_name} may not skip a guard or name another environment")
        if parsed.line in WINDOW_SETTING_LINES:
            if parsed.arguments.window != window_name:
                raise WindowRefusal(f"{window_name} may use only its own settings")
            return
        if parsed.line == WINDOW_SEARCH_LINE:
            if parsed.arguments.window != window_name:
                raise WindowRefusal(f"{window_name} may use only its own search")
            return
        declared = window.reads if parsed.is_read else window.runs
        if parsed.line not in declared:
            self.check_button(window_name, argv, parsed, person, environment)
            return
        permission_type = WindowPermissionType.READS if parsed.is_read else WindowPermissionType.RUNS
        if not window.shipped and parsed.line not in self.allowances.allowed_lines(person.id, self.environment_names.environment_id(environment), window_name, permission_type):
            raise WindowRefusal(f"{window_name} may run {parsed.line} once you allow it")

    def check_button(self, window_name: str, argv: list[str], parsed: ParsedLine, person: Actor, environment: str) -> None:
        buttons = [button for button in self.registry.button_lines(window_name) if button.allows(argv)]
        if not buttons:
            raise WindowRefusal(f"{window_name} does not declare {parsed.line}")
        if any(button.shipped for button in buttons):
            return
        module = buttons[0].module
        if parsed.line in PERSON_LINES:
            raise WindowRefusal(f"{module} may never run {parsed.line}: only a person gives rights and changes settings")
        environment_id = self.environment_names.environment_id(environment)
        if not any(parsed.line in self.allowances.allowed_lines(person.id, environment_id, button.subject, WindowPermissionType.RUNS) for button in buttons):
            raise WindowRefusal(f"{module} may run {parsed.line} once you allow it")

    def parsed(self, window_name: str, argv: list[str]) -> ParsedLine:
        if len(argv) < 2:
            raise UsageError(f"{window_name} sent no command line")
        subcommand, parser = self.line_parser.parser(argv)
        try:
            return ParsedLine(subcommand, parser.parse_args(argv[2:]))
        except SystemExit as exit_request:
            raise UsageError(f"{window_name} sent a line that does not parse: {' '.join(argv)}") from exit_request
