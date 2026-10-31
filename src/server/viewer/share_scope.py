from core.base.cli.usage_error import UsageError
from core.base.environment_names import EnvironmentNames
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.viewer.commands.support.window_lines import WindowLines
from server.viewer.share_refusal import ShareRefusal
from server.viewer.shared_row import SharedRow

COMMAND_REFUSAL = "a share link only reads"
UNSHARED_REFUSAL = "this is not shared by the link"
OTHER_ENVIRONMENT_REFUSAL = "another environment is not shared by the link"
OTHER_ROW_REFUSAL = "this row is not shared by the link"
UNSHARED_LINE_REFUSAL = "this line is not shared by the link"


class ShareScope:
    """Whether a share session may send a line: it parses, it reads (a write never does, with a guard skipped
    or not), it stays in the link's environment, and the shared window marks the line shareable with the id of
    the shared row. It checks the parsed line, never its raw words."""

    def __init__(self, registry: Registry, lines: WindowLines, environment_names: EnvironmentNames) -> None:
        self.registry, self.lines, self.environment_names = registry, lines, environment_names

    def check(self, shared: SharedRow, window_name: str, argv: list[str], environment: str) -> None:
        if not self.registry.has_window(window_name):
            raise ShareRefusal(UNSHARED_REFUSAL)
        try:
            parsed = self.lines.parsed(window_name, argv)
        except UsageError as error:
            raise ShareRefusal(UNSHARED_REFUSAL) from error
        if not parsed.is_read:
            raise ShareRefusal(COMMAND_REFUSAL)
        if self.environment_id(environment) != shared.environment_id or getattr(parsed.arguments, "environment", None) not in (None, environment):
            raise ShareRefusal(OTHER_ENVIRONMENT_REFUSAL)
        names = [entry.rsplit(" ", 1)[1] for entry in self.registry.window(window_name).shareable if entry.rsplit(" ", 1)[0] == parsed.line]
        if not names:
            raise ShareRefusal(f"{UNSHARED_LINE_REFUSAL}: {parsed.line}")
        if getattr(parsed.arguments, names[0], None) != shared.id:
            raise ShareRefusal(f"{OTHER_ROW_REFUSAL}: {getattr(parsed.arguments, names[0], None)!r} is not {shared.id}")

    def environment_id(self, environment: str) -> int | None:
        try:
            return self.environment_names.environment_id(environment)
        except Refusal:
            return None
