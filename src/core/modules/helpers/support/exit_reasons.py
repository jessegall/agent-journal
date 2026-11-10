import re

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.provider.providers import Providers
from core.modules.agents.models.agent import Agent

TAIL_BYTES = 20000
ENDED_WITHOUT_REPORT = "It ended without a report"
PLAIN_REASONS = ((re.compile(r"rate.?limit|usage limit|too many requests|\b429\b", re.IGNORECASE), "it hit a rate limit", True),
                 (re.compile(r"not logged in|please run /login|invalid api key|login expired|expired token|\b401\b|authentication", re.IGNORECASE), "its login expired", True),
                 (re.compile(r"unknown model|invalid model|model.{0,40}(not found|does not exist|not supported)", re.IGNORECASE), "its model is not known", False))
PROVIDER_ERROR_LINE = re.compile(r"^(?:api error:|error:|please run /login\b|not logged in\b|login expired\b|invalid api key\b|expired token\b|rate.?limit\b|usage limit\b|too many requests\b|you(?:'ve| have) hit your usage limit\b)", re.IGNORECASE)


class ExitReasons:
    """Says in plain words why a program ended, from the end of its terminal log and its exit code."""

    def __init__(self, home: JournalHome, providers: Providers) -> None:
        self.home, self.providers = home, providers

    def reason(self, agent: Agent, exit_code: int, launch_ended: bool, output: str) -> str:
        if launch_ended:
            return f"{ENDED_WITHOUT_REPORT}: the journal launch that ran it ended."
        outcome = self.providers.provider(agent.program).helper_outcome(output, "")
        error = outcome.error or output
        matched = next((reason for pattern, reason, _ in PLAIN_REASONS if pattern.search(error)), None)
        if matched is not None:
            return f"{ENDED_WITHOUT_REPORT}: {matched}."
        return f"{ENDED_WITHOUT_REPORT}: its program exited with code {exit_code}." if exit_code else f"{ENDED_WITHOUT_REPORT}."

    def program_problem(self, agent: Agent, output: str) -> str:
        lines = output.strip().splitlines()
        if not lines:
            return ""
        last_line = lines[-1].strip()
        outcome = self.providers.provider(agent.program).helper_outcome(last_line, "")
        if outcome.error is None and not PROVIDER_ERROR_LINE.match(last_line):
            return ""
        error = outcome.error if outcome.error is not None else last_line
        return next((reason for pattern, reason, is_program_problem in PLAIN_REASONS
                     if is_program_problem and pattern.search(error)), "")

    def terminal_tail(self, agent: Agent) -> str:
        path = self.home.terminal_file(agent.id)
        return "" if not path.is_file() else FileAccess.shared().read(path)[-TAIL_BYTES:]
