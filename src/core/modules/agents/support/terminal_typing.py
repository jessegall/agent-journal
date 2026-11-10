from engine.journal.journal_home import LAUNCHER_SOCKET, JournalHome
from engine.errors.refusal import Refusal
from core.base.driver.program_lockdown import ProgramLockdown
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink

TERMINAL_ANSWER = b"typed"
LAUNCHER_MISSING = "no launcher is running here"
LOCKDOWN_SUGGESTION = "lift the usage limit first, or wait until it ends"
TYPING_FAILED = "the launcher did not type the line"
TYPING_SUGGESTION = "it types only for an agent it started, and a launcher older than this journal does not type at all: start the agent again with journal launch"


class TerminalTyping:
    """Hands the running launcher a line to type into an agent's terminal, and refuses unless it answers that
    it did. Nothing is typed into an agent whose program is locked down at a usage limit: every wake, message
    line and line a person types passes here, so each is refused with the stop line and stays waiting."""

    lockdown: ProgramLockdown = ProgramLockdown()

    def __init__(self, home: JournalHome, link: LauncherLink, lockdown: ProgramLockdown) -> None:
        self.home, self.link, self.lockdown = home, link, lockdown

    def type_line(self, agent: Agent, line: str) -> None:
        lockdown = self.lockdown.lockdown(agent.program)
        if lockdown.is_active:
            raise Refusal(lockdown.stop_line, LOCKDOWN_SUGGESTION)
        self.send_line(agent.terminal_id, line)

    def send_line(self, terminal_id: int, line: str) -> None:
        if not self.home.socket(LAUNCHER_SOCKET).exists():
            raise Refusal(LAUNCHER_MISSING, "start the agent with journal launch")
        if self.link.request_launcher({"agent_id": terminal_id, "typed": line}, len(TERMINAL_ANSWER)) != TERMINAL_ANSWER:
            raise Refusal(TYPING_FAILED, TYPING_SUGGESTION)
