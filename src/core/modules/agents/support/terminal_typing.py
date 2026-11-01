import json
import socket

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.base.refusal import Refusal

ANSWER_LIMIT_SECONDS = 5
TYPED_ANSWER = b"typed"
NO_LAUNCHER = "no launcher is running here"
NOT_TYPED = "the launcher did not type the line"
NOT_TYPED_SUGGESTION = "it types only for an agent it started, and a launcher older than this journal does not type at all: start the agent again with journal launch"


class TerminalTyping:
    """Hands the running launcher a line to type into an agent's terminal, and refuses unless it answers that it did."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def type_line(self, agent_id: int, line: str) -> None:
        path = self.home.socket(LAUNCHER_SOCKET)
        if not path.exists():
            raise Refusal(NO_LAUNCHER, "start the agent with journal launch")
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as connection:
            connection.settimeout(ANSWER_LIMIT_SECONDS)
            try:
                connection.connect(str(path))
                connection.sendall((json.dumps({"agent_id": agent_id, "typed": line}) + "\n").encode())
                answer = connection.recv(len(TYPED_ANSWER))
            except OSError as error:
                raise Refusal(NOT_TYPED, NOT_TYPED_SUGGESTION) from error
        if answer != TYPED_ANSWER:
            raise Refusal(NOT_TYPED, NOT_TYPED_SUGGESTION)
