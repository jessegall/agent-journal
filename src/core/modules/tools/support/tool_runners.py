from core.modules.tools.support.tool_runner import ToolRunner


class ToolRunners:
    """The tools the journal supports, as the loaded suites bind them; core ships none of its own."""

    def all(self) -> tuple[ToolRunner, ...]:
        return ()
