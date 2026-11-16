from dataclasses import replace

from engine.enums.command_category import CommandCategory
from engine.enums.execution_source import ExecutionSource
from engine.enums.process_type import ProcessType
from engine.enums.starter_type import StarterType
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.classes.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.classes.process_classes import ProcessClasses


class StartProcessClasses:
    """The class a run takes when it starts: a plugin's kind its own class, any other line the class of its parts."""

    def __init__(self, classes: ExecutionClasses, process_classes: ProcessClasses) -> None:
        self.classes, self.process_classes = classes, process_classes

    def chosen(self, command: StartProcess, agent: Agent) -> ExecutionClass:
        starter = self.starter(command, agent)
        # a plugin's kind keeps its plugin's class, even one named like a journal kind such as merge
        if command.plugin:
            plugin_class = self.classes.match(ExecutionSubject(ExecutionSource.PLUGIN_PROGRAM, starter, category=command.category, plugin_name=command.plugin,
                                                              plugin_category=command.run_name, line=command.line))
            return replace(plugin_class, name=f"{command.plugin} {command.run_name}") if command.run_name and not plugin_class.plugin else plugin_class
        if command.is_graphify:
            return self.classes.match(ExecutionSubject(ExecutionSource.GRAPHIFY, starter, category=command.category, line=command.line))
        if command.is_journal_merge:
            return self.classes.match(ExecutionSubject(ExecutionSource.SHELL_LINE, starter, category=command.category, process_type=ProcessType.MERGE, line=command.line))
        if command.reaches_full_suite:
            return self.classes.match(ExecutionSubject(ExecutionSource.SHELL_LINE, starter, category=command.category, process_type=ProcessType.FULL_TEST_RUN, line=command.line))
        # a part of unknown category says nothing of the line, which then takes the category the start names
        recorded = [part.category for part in command.parts if part.category is not CommandCategory.UNKNOWN]
        return self.process_classes.category_class(recorded or [command.category], command.line, agent)

    @staticmethod
    def starter(command: StartProcess, agent: Agent) -> ExecutionStarter:
        if command.plugin:
            return ExecutionStarter(StarterType.PLUGIN, plugin_name=command.plugin)
        return ProcessClasses.agent_starter(agent)
