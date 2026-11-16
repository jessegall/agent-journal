from collections.abc import Sequence
from engine.enums.command_category import CommandCategory

from engine.enums.agent_role import AgentRole
from engine.enums.execution_source import ExecutionSource
from engine.enums.starter_type import StarterType
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.classes.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from core.modules.agents.models.agent import Agent


class ProcessClasses:
    """The class of an agent's shell line by the categories of its parts: its longest pool and highest cost."""

    def __init__(self, classes: ExecutionClasses) -> None:
        self.classes = classes

    # the class of an agent's shell line by the categories of its parts: its longest lane and highest cost
    def category_class(self, categories: Sequence[CommandCategory], line: str, agent: Agent) -> ExecutionClass:
        starter = self.agent_starter(agent)
        return self.classes.line_class([ExecutionSubject(ExecutionSource.SHELL_LINE, starter, category=category, line=line) for category in categories])

    @staticmethod
    def agent_starter(agent: Agent) -> ExecutionStarter:
        if agent.role == AgentRole.MAIN:
            return ExecutionStarter(StarterType.MAIN_AGENT, agent_id=agent.id)
        return ExecutionStarter(StarterType.HELPER, agent_id=agent.id, agent_role=str(agent.role))
