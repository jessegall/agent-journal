import re
import subprocess

from journal.config import Config
from journal.console.console import Console
from journal.console.where import Where
from journal.engine.nudger import Nudger
from journal.events.agent.tool_finished import ToolFinished
from journal.features.git.head_commit import HeadCommit
from journal.events.agent_listener import AgentListener
from journal.models.actor import Actor
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink

COMMIT = "commit"
TRAILER = re.compile(r"^Journal: (?:tasks|todos) done ((?:\d+(?:[ ,]+(?:and +)?)?)+)\s*(.*)$", re.MULTILINE)
"""The line, on its own and at column zero, that closes tasks when the commit lands: the numbers, then what was done."""


class SpotCommit(AgentListener[ToolFinished]):
    """A shell command that committed is followed by a look at the head: the commit becomes an entry the chat shows as a badge, and a Journal: tasks done line in its message finishes those tasks and says so."""

    def __init__(self, config: Config, entries: Entries, console: Console, environments: Environments, agents: Agents, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.config, self.entries, self.console, self.environments, self.agents, self.nudger, self.supervisor = config, entries, console, environments, agents, nudger, supervisor

    def handle(self, event: ToolFinished) -> None:
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        if "git commit" not in command:
            return
        head = self.head()
        if not head or any(e.data.get("sha") == head.sha for e in self.entries.of_kind(COMMIT, 20)):
            return
        by = Actor.agent(event.session)
        self.entries.save(Entry(environment_id=event.environment_id, kind=COMMIT, actor=by, data={"sha": head.sha, "subject": head.subject, "branch": head.branch, "session": event.session}), by)
        self.close_named(event, head.sha, head.body)

    def close_named(self, event: ToolFinished, sha: str, body: str) -> None:
        from journal.features.tasks.feature import Tasks
        numbers = [int(n) for found in TRAILER.finditer(body) for n in re.findall(r"\d+", found.group(1))]
        if not numbers:
            return
        where = Where(self.environments.find(event.environment_id).name, event.session)
        closed = [n for n in numbers if self.console.run(["task", "done", str(n), "--how", f"commit {sha[:8]}"], where).code == 0]
        if closed:
            line = self.nudger.say(self.agents.for_session(event.session), Tasks.CLOSED_BY_COMMIT.about(sha=sha[:8], tasks=", ".join(f"task {n}" for n in closed)))
            if line:
                self.supervisor.type(event.environment_id, line)

    def head(self) -> HeadCommit | None:
        try:
            out = subprocess.run(["git", "log", "-1", "--format=%H%n%s%n%B"], cwd=self.config.root, capture_output=True, text=True, timeout=5)
            branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=self.config.root, capture_output=True, text=True, timeout=5).stdout.strip()
        except (OSError, subprocess.TimeoutExpired):
            return None
        if out.returncode != 0 or not out.stdout.strip():
            return None
        sha, _, rest = out.stdout.strip().partition("\n")
        subject, _, body = rest.partition("\n")
        return HeadCommit(sha, subject, branch, body)
