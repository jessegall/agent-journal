from engine.caller.process_command import ProcessCommand
from engine.caller.process_table import ProcessTable
from engine.journal.journal_home import JournalHome
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.agents.support.launcher_service import SERVICE_ARGUMENT

ROOT_PROCESS_PID = 1


class LauncherProcesses:
    """The launcher processes of this journal that run on the machine. One serves the journal: the one the
    link beside the socket names, else the one with the lowest process number. Another one is unused when no
    terminal started it and no process runs under it: nothing reaches it and it runs no program. A launcher
    a terminal or an older launcher started is left alone: it ends by itself with its terminal."""

    def __init__(self, home: JournalHome, process_table: ProcessTable, link: LauncherLink) -> None:
        self.home, self.process_table, self.link = home, process_table, link

    @property
    def program(self) -> str:
        return str(self.home.folder / "bin" / "journal")

    def unused(self) -> tuple[tuple[ProcessCommand, ProcessCommand], ...]:
        processes = self.process_table.commands()
        launchers = sorted((process for process in processes if process.command_parts[:2] == (self.program, SERVICE_ARGUMENT)), key=lambda process: process.pid)
        if len(launchers) < 2:
            return ()
        owner_pid = self.link.owner_pid
        serving = next((launcher for launcher in launchers if launcher.pid == owner_pid), launchers[0])
        parent_pids = {process.parent_pid for process in processes}
        return tuple((serving, launcher) for launcher in launchers
                     if launcher.pid != serving.pid and launcher.parent_pid == ROOT_PROCESS_PID and launcher.pid not in parent_pids)
