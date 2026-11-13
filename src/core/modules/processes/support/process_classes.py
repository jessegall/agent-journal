from dataclasses import replace

from engine.enums.agent_role import AgentRole
from engine.enums.execution_source import ExecutionSource
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
        if command.plugin:
            plugin_class = self.classes.match(ExecutionSubject(ExecutionSource.PLUGIN_PROGRAM, starter, category=command.category, plugin_name=command.plugin,
                                                              plugin_kind=command.run_name, line=command.line))
            return replace(plugin_class, name=f"{command.plugin} {command.run_name}") if command.run_name and not plugin_class.plugin else plugin_class
        subjects = [ExecutionSubject(ExecutionSource.SHELL_LINE, starter, category=part.category, line=command.line) for part in command.parts]
        return self.classes.for_line(subjects or [ExecutionSubject(ExecutionSource.SHELL_LINE, starter, category=command.category, line=command.line)])

    @staticmethod
    def starter(command: StartProcess, agent: Agent) -> ExecutionStarter:
        if command.plugin:
            return ExecutionStarter(StarterType.PLUGIN, plugin_name=command.plugin)
        if agent.role == AgentRole.MAIN:
            return ExecutionStarter(StarterType.MAIN_AGENT, agent_id=agent.id)
        return ExecutionStarter(StarterType.HELPER, agent_id=agent.id, agent_role=str(agent.role))
