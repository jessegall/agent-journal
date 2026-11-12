from core.modules.tools.support.tool_runner import ToolRunner
from core.modules.tools.support.tool_runners import ToolRunners
from suites.coding.support.graphify_tool import GraphifyTool


class CodingToolRunners(ToolRunners):
    """The tools the coding suite ships: Graphify, the code search it keeps a graph for."""

    def __init__(self, graphify: GraphifyTool) -> None:
        self.graphify = graphify

    def all(self) -> tuple[ToolRunner, ...]:
        return tuple([self.graphify])
