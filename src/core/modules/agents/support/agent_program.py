import time

from engine.caller.process_table import ProcessTable
from engine.process.leftover_process import POLL_SECONDS, LeftoverProcess
from core.base.provider.providers import Providers
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink

STOP_WAIT_SECONDS = 5


class AgentProgram:
    """Stops an agent's program through its launcher, or its recorded process with the processes under it."""

    def __init__(self, providers: Providers, launcher: LauncherLink, process_table: ProcessTable) -> None:
        self.providers, self.launcher, self.process_table = providers, launcher, process_table

    def stop(self, agent: Agent) -> bool:
        if self.launcher.stop(agent.terminal_id):
            return True
        if agent.pid is None:
            return False
        return self.stop_tree(agent.pid, self.providers.executable(agent.program))

    def request_stop(self, agent: Agent) -> None:
        self.launcher.request_stop(agent.terminal_id)

    def stop_tree(self, pid: int, program: str) -> bool:
        if not LeftoverProcess.runs_program(pid, program):
            return True
        children = self.descendants(pid)
        commands = {child: LeftoverProcess.command_line(child) for child in children}
        for child in reversed(children):
            if commands[child]:
                LeftoverProcess.stop(child, commands[child])
        if not LeftoverProcess.stop(pid, program):
            commands[pid] = program
        deadline = time.monotonic() + STOP_WAIT_SECONDS
        while self.running(commands) and time.monotonic() < deadline:
            time.sleep(POLL_SECONDS)
        return not self.running(commands)

    def descendants(self, pid: int) -> list[int]:
        rows = self.process_table.rows()
        parents = {pid}
        descendants: list[int] = []
        while parents:
            children = [row.pid for row in rows if row.parent_pid in parents and row.pid not in parents]
            descendants.extend(children)
            parents = set(children)
        return descendants

    @staticmethod
    def running(commands: dict[int, str]) -> bool:
        return any(LeftoverProcess.runs_program(pid, command) for pid, command in commands.items())
