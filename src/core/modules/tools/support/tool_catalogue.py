from engine.errors.refusal import Refusal
from core.modules.tools.support.tool_definition import ToolDefinition
from core.modules.tools.support.tool_runner import ToolRunner
from core.modules.tools.support.tool_runners import ToolRunners


class ToolCatalogue:
    """The tools the journal supports, as the loaded suites bind them."""

    def __init__(self, runners: ToolRunners) -> None:
        self.runners = runners

    def all(self) -> tuple[ToolDefinition, ...]:
        return tuple(runner.definition for runner in self.runners.all())

    def find(self, name: str) -> ToolDefinition:
        return self.runner(name).definition

    def runner(self, name: str) -> ToolRunner:
        for runner in self.runners.all():
            if runner.definition.name == name:
                return runner
        raise Refusal(f"no supported tool is called {name}", f"one of: {', '.join(tool.name for tool in self.all())}" if self.all() else "no suite here ships a tool")
