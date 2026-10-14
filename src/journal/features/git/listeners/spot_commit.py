import subprocess

from journal.config import Config
from journal.events.agent.tool_finished import ToolFinished
from journal.features.agent_listener import AgentListener
from journal.models.actor import Actor
from journal.models.entry import Entry
from journal.repositories.entries import Entries

COMMIT = "commit"


class SpotCommit(AgentListener[ToolFinished]):
    """A shell command that committed is followed by a look at the head, so the commit is an entry the chat shows as a badge, whatever the command printed."""

    def __init__(self, config: Config, entries: Entries) -> None:
        self.config, self.entries = config, entries

    def handle(self, event: ToolFinished) -> None:
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        if "git commit" not in command:
            return
        head = self.head()
        if not head:
            return
        sha, subject, branch = head
        if any(e.data.get("sha") == sha for e in self.entries.of_kind(event.environment_id, COMMIT, 20)):
            return
        self.entries.save(Entry(environment_id=event.environment_id, kind=COMMIT, actor=Actor.agent(event.session), data={"sha": sha, "subject": subject, "branch": branch, "session": event.session}), Actor.agent(event.session))

    def head(self) -> tuple[str, str, str] | None:
        try:
            out = subprocess.run(["git", "log", "-1", "--format=%H%n%s"], cwd=self.config.root, capture_output=True, text=True, timeout=5)
            branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=self.config.root, capture_output=True, text=True, timeout=5).stdout.strip()
        except (OSError, subprocess.TimeoutExpired):
            return None
        if out.returncode != 0 or not out.stdout.strip():
            return None
        sha, _, subject = out.stdout.strip().partition("\n")
        return sha, subject, branch
