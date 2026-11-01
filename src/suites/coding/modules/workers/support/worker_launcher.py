import json
import socket

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.base.provider.launch_command import LaunchCommand
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment

SOCKET_LIMIT_SECONDS = 5


class WorkerLauncher:
    """Hands the running launcher a worker's program, folder and agent row to start, and says whether it could."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def hand(self, worker: Agent, environment: Environment, command: LaunchCommand) -> bool:
        request = {"agent_id": worker.id, "session": worker.session, "environment": environment.name, "folder": str(command.folder),
                   "command": list(command.arguments), "variables": dict(command.variables)}
        path = self.home.socket(LAUNCHER_SOCKET)
        if not path.exists():
            return False
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as connection:
            connection.settimeout(SOCKET_LIMIT_SECONDS)
            try:
                connection.connect(str(path))
            except OSError:
                return False
            connection.sendall((json.dumps(request) + "\n").encode())
        return True
