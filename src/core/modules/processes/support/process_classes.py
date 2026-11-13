from collections.abc import Sequence
from dataclasses import replace

from engine.enums.command_category import CommandCategory

from engine.enums.agent_role import AgentRole
from engine.enums.execution_source import ExecutionSource
from engine.enums.process_type import ProcessType
from engine.enums.starter_type import StarterType
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process.start_process import StartProcess


class ProcessClasses:
    """The class a run takes when it starts: a plugin's kind its own class, any other line the class of its parts,
    its longest lane and highest cost."""

    def __init__(self, classes: ExecutionClasses) -> None:
        self.classes = classes

    def chosen(self, command: StartProcess, agent: Agent) -> ExecutionClass:
        starter = self.starter(command, agent)
        if command.is_journal_merge:
            return self.classes.match(ExecutionSubject(ExecutionSource.SHELL_LINE, starter, category=command.category, process_type=ProcessType.MERGE, line=command.line))
        if command.plugin:
            plugin_class = self.classes.match(ExecutionSubject(ExecutionSource.PLUGIN_PROGRAM, starter, category=command.category, plugin_name=command.plugin,
                                                              plugin_kind=command.run_name, line=command.line))
            return replace(plugin_class, name=f"{command.plugin} {command.run_name}") if command.run_name and not plugin_class.plugin else plugin_class
        return self.for_categories([part.category for part in command.parts] or [command.category], command.line, agent)

    # the class of an agent's shell line by the categories of its parts: its longest lane and highest cost
    def for_categories(self, categories: Sequence[CommandCategory], line: str, agent: Agent) -> ExecutionClass:
        starter = self.agent_starter(agent)
        return self.classes.for_line([ExecutionSubject(ExecutionSource.SHELL_LINE, starter, category=category, line=line) for category in categories])

    @staticmethod
    def starter(command: StartProcess, agent: Agent) -> ExecutionStarter:
        if command.plugin:
            return ExecutionStarter(StarterType.PLUGIN, plugin_name=command.plugin)
        return ProcessClasses.agent_starter(agent)

    @staticmethod
    def agent_starter(agent: Agent) -> ExecutionStarter:
        if agent.role == AgentRole.MAIN:
            return ExecutionStarter(StarterType.MAIN_AGENT, agent_id=agent.id)
        return ExecutionStarter(StarterType.HELPER, agent_id=agent.id, agent_role=str(agent.role))
