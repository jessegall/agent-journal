from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.mark_outcome import MarkOutcome
from engine.module.helper_type_check import AGENTS_MODULE
from engine.module.module_actors import ModuleActors
from engine.process.leftover_process import LeftoverProcess
from engine.query.queries import Queries
from core.modules.agents.commands.stop_unused_launcher.stop_unused_launcher import StopUnusedLauncher
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant
from core.modules.agents.support.launcher_processes import LauncherProcesses
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.models.chat_mark import ChatMark

MARK_TEXT = "Two launchers of this journal ran at once: process {serving} serves the journal. Process {unused} ran no program and is stopped."


class StopUnusedLauncherHandler(Handler[StopUnusedLauncher, None]):
    """Shows a mark in the chat that names both launcher processes and stops the second one, the first time
    the pair is seen: a pair already shown is left alone, so a process that does not go is not signalled on
    every tick."""

    command = StopUnusedLauncher

    def __init__(self, bus: Bus, queries: Queries, processes: LauncherProcesses, actors: ModuleActors) -> None:
        self.bus, self.queries, self.processes, self.actors = bus, queries, processes, actors

    def handle(self, command: StopUnusedLauncher, context: Context) -> None:
        key = f"launchers:{command.serving_pid}:{command.unused_pid}"
        if self.queries.query(ChatMark).filter(key=key).exists():
            return
        text = MARK_TEXT.format(serving=command.serving_pid, unused=command.unused_pid)
        mark = ShowMark(AgentMarkType.LAUNCHER, AgentMarkVariant.STOPPED, key, text, outcome=MarkOutcome.PASSED, ended=True)
        self.bus.dispatch(mark, replace(context, actor=self.actors.actor(AGENTS_MODULE)))
        LeftoverProcess.stop(command.unused_pid, self.processes.program)
