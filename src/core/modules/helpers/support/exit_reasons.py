import re

from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.modules.agents.models.agent import Agent

TAIL_BYTES = 20000
ENDED_WITHOUT_REPORT = "It ended without a report"
PLAIN_REASONS = ((re.compile(r"rate.?limit|usage limit|too many requests|\b429\b", re.IGNORECASE), "it hit a rate limit"),
                 (re.compile(r"not logged in|please run /login|invalid api key|login expired|expired token|\b401\b|authentication", re.IGNORECASE), "its login expired"),
                 (re.compile(r"unknown model|invalid model|model.{0,40}(not found|does not exist|not supported)", re.IGNORECASE), "its model is not known"))


class ExitReasons:
    """Says in plain words why a program ended, from the end of its terminal log and its exit code."""

    def __init__(self, home: JournalHome, providers: Providers) -> None:
        self.home, self.providers = home, providers

    def reason(self, agent: Agent, exit_code: int) -> str:
        output = self.terminal_tail(agent)
        outcome = self.providers.provider(agent.program).helper_outcome(output, "")
        error = outcome.error or output
        found = next((reason for pattern, reason in PLAIN_REASONS if pattern.search(error)), None)
        if found is not None:
            return f"{ENDED_WITHOUT_REPORT}: {found}."
        return f"{ENDED_WITHOUT_REPORT}: its program exited with code {exit_code}." if exit_code else f"{ENDED_WITHOUT_REPORT}."

    def terminal_tail(self, agent: Agent) -> str:
        path = self.home.terminal_file(agent.id)
        return "" if not path.is_file() else FileAccess.shared().read(path)[-TAIL_BYTES:]
