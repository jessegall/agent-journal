import json
import socket

from core.base.change.logged_event import LoggedEvent
from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_command import WorkerCommand

SOCKET_LIMIT_SECONDS = 5


class WorkerProgramListener(CommitListener):
    """A worktree just cut hands the running launcher its worker's program, folder and agent row to start."""

    name = "workers.worker-program-request"
    event = "worker_worktree.cut"

    def __init__(self, home: JournalHome, queries: Queries, worker_command: WorkerCommand) -> None:
        self.home, self.queries, self.worker_command = home, queries, worker_command

    def handle(self, event: LoggedEvent) -> None:
        worktree = self.queries.query(Worktree).find(event.row_id)
        worker = self.queries.query(Agent).find(worktree.agent_id)
        environment = self.queries.query(Environment).find(worktree.environment_id)
        command = self.worker_command.command(worker, worktree, environment, self.queries.query(Task).find(worktree.task_id))
        request = {"agent_id": worker.id, "session": worker.session, "environment": environment.name, "folder": str(command.folder),
                   "command": list(command.arguments), "variables": dict(command.variables)}
        path = self.home.socket(LAUNCHER_SOCKET)
        if not path.exists():
            return
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as connection:
            connection.settimeout(SOCKET_LIMIT_SECONDS)
            try:
                connection.connect(str(path))
            except OSError:
                return
            connection.sendall((json.dumps(request) + "\n").encode())
