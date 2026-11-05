import re

from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.modules.agents.models.agent import Agent
from core.modules.helpers.commands.record_program_exit.record_program_exit import RecordProgramExit

TAIL_BYTES = 20000
ENDED_WITHOUT_REPORT = "It ended without a report"
PLAIN_REASONS = ((re.compile(r"rate.?limit|usage limit|too many requests|\b429\b", re.IGNORECASE), "it hit a rate limit"),
                 (re.compile(r"not logged in|please run /login|invalid api key|login expired|expired token|\b401\b|authentication", re.IGNORECASE), "its login expired"),
                 (re.compile(r"unknown model|invalid model|model.{0,40}(not found|does not exist|not supported)", re.IGNORECASE), "its model is not known"))


class ExitReasons:
    """Says in plain words why a program ended, from the end of its terminal log and its exit code."""

    def __init__(self, home: JournalHome, providers: Providers) -> None:
        self.home, self.providers = home, providers

    def reason(self, agent: Agent, command: RecordProgramExit) -> str:
        if command.launch_ended:
            return f"{ENDED_WITHOUT_REPORT}: the journal launch that ran it ended."
        output = self.terminal_tail(agent)
        outcome = self.providers.provider(agent.program).helper_outcome(output, "")
        error = outcome.error or output
        matched = next((reason for pattern, reason in PLAIN_REASONS if pattern.search(error)), None)
        if matched is not None:
            return f"{ENDED_WITHOUT_REPORT}: {matched}."
        return f"{ENDED_WITHOUT_REPORT}: its program exited with code {command.exit_code}." if command.exit_code else f"{ENDED_WITHOUT_REPORT}."

    def terminal_tail(self, agent: Agent) -> str:
        path = self.home.terminal_file(agent.id)
        return "" if not path.is_file() else FileAccess.shared().read(path)[-TAIL_BYTES:]
