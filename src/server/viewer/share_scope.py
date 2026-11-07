from core.base.cli.usage_error import UsageError
from core.base.environment_names import EnvironmentNames
from core.base.container import Container
from core.base.query.shared_rows import SharedRows
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.viewer.commands.support.window_lines import WindowLines
from server.viewer.shared_windows import SharedWindows
from server.viewer.share_refusal import ShareRefusal
from server.viewer.shared_row import SharedRow

COMMAND_REFUSAL = "a share link only reads"
UNSHARED_REFUSAL = "this is not shared by the link"
ENVIRONMENT_REFUSAL = "another environment is not shared by the link"
ROW_REFUSAL = "this row is not shared by the link"
UNSHARED_LINE_REFUSAL = "this line is not shared by the link"


class ShareScope:
    """Whether a share session may send a line: it parses, it reads (a write never does, with a guard skipped
    or not), it stays in the link's environment, and the window the row's model picks lists the line in
    shared_reads with the argument that names an id of the shared row or of a row it includes. It checks the
    parsed line, never its raw words."""

    def __init__(self, registry: Registry, lines: WindowLines, environment_names: EnvironmentNames, container: Container) -> None:
        self.registry, self.lines, self.environment_names, self.container = registry, lines, environment_names, container

    def check(self, shared: SharedRow, argv: list[str], environment: str) -> None:
        window_name = SharedWindows(self.registry).window(shared.model).name
        try:
            parsed = self.lines.parsed(window_name, argv)
        except UsageError as error:
            raise ShareRefusal(UNSHARED_REFUSAL) from error
        if not parsed.is_read:
            raise ShareRefusal(COMMAND_REFUSAL)
        if self.environment_id(environment) != shared.environment_id or getattr(parsed.arguments, "environment", None) not in (None, environment):
            raise ShareRefusal(ENVIRONMENT_REFUSAL)
        names = [entry.rsplit(" ", 1)[1] for entry in self.registry.window(window_name).shared_reads if entry.rsplit(" ", 1)[0] == parsed.line]
        if not names:
            raise ShareRefusal(f"{UNSHARED_LINE_REFUSAL}: {parsed.line}")
        requested_id = getattr(parsed.arguments, names[0], None)
        model = parsed.line.split(" ", 1)[0].replace("-", "_") if names[0] == "id" else names[0].removesuffix("_id")
        if requested_id not in self.shared_ids(shared, model):
            raise ShareRefusal(f"{ROW_REFUSAL}: {requested_id!r} is not part of what is shared")

    def shared_ids(self, shared: SharedRow, model: str) -> list[int]:
        if model == shared.model:
            return [shared.id]
        if shared.model not in self.registry.shared_rows:
            return []
        shared_rows = self.container.get(self.registry.shared_rows[shared.model].checked_class(SharedRows))
        return [row_id for group in shared_rows.rows(shared.id) if group.model == model for row_id in group.ids]

    def environment_id(self, environment: str) -> int | None:
        try:
            return self.environment_names.environment_id(environment)
        except Refusal:
            return None
