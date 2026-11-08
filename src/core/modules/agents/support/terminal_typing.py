from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.base.refusal import Refusal
from core.modules.agents.support.launcher_link import LauncherLink

TERMINAL_ANSWER = b"typed"
LAUNCHER_MISSING = "no launcher is running here"
TYPING_FAILED = "the launcher did not type the line"
TYPING_SUGGESTION = "it types only for an agent it started, and a launcher older than this journal does not type at all: start the agent again with journal launch"


class TerminalTyping:
    """Hands the running launcher a line to type into an agent's terminal, and refuses unless it answers that
    it did."""

    def __init__(self, home: JournalHome, link: LauncherLink) -> None:
        self.home, self.link = home, link

    def type_line(self, agent_id: int, line: str) -> None:
        if not self.home.socket(LAUNCHER_SOCKET).exists():
            raise Refusal(LAUNCHER_MISSING, "start the agent with journal launch")
        if self.link.request_launcher({"agent_id": agent_id, "typed": line}, len(TERMINAL_ANSWER)) != TERMINAL_ANSWER:
            raise Refusal(TYPING_FAILED, TYPING_SUGGESTION)
