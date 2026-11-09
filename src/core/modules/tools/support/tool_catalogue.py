from engine.errors.refusal import Refusal
from core.modules.tools.support.tool_definition import ToolDefinition
from core.modules.tools.support.tool_setting import GRAPHIFY_SETTINGS

GRAPHIFY = ToolDefinition("graphify", "Graphify", "Keeps a graph of the project's code in graphify-out, refreshed after each new commit without an LLM, so agents read it warm.",
                          GRAPHIFY_SETTINGS)


class ToolCatalogue:
    """The tools the journal supports."""

    def all(self) -> tuple[ToolDefinition, ...]:
        return tuple([GRAPHIFY])

    def find(self, name: str) -> ToolDefinition:
        for tool in self.all():
            if tool.name == name:
                return tool
        raise Refusal(f"no supported tool is called {name}", f"one of: {', '.join(tool.name for tool in self.all())}")
