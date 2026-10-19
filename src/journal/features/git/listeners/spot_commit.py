import re
import subprocess

from journal.config import Config
from journal.console.console import Console
from journal.console.where import Where
from journal.engine.cards import Cards
from journal.engine.nudger import Nudger
from journal.events.agent.tool_finished import ToolFinished
from journal.features.git.head_commit import HeadCommit
from journal.events.agent_listener import AgentListener
from journal.events.decision import Decision
from journal.models.actor import Actor
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.repositories.environments import Environments

COMMIT = "commit"
TRAILER = re.compile(r"^Journal: (?:tasks|todos) done ((?:\d+(?:[ ,]+(?:and +)?)?)+)\s*(.*)$", re.MULTILINE)
"""The line, on its own and at column zero, that closes tasks when the commit lands: the numbers, then what was done."""


class SpotCommit(AgentListener[ToolFinished]):
    """A shell command that committed is followed by a look at the head: the commit becomes a card in the chat, once, and a Journal: tasks done line in its message finishes those tasks and says so in the reply to that command."""

    blocking = True

    def __init__(self, config: Config, cards: Cards, messages: Messages, console: Console, environments: Environments, agents: Agents, nudger: Nudger) -> None:
        self.config, self.cards, self.messages, self.console, self.environments, self.agents, self.nudger = config, cards, messages, console, environments, agents, nudger

    def handle(self, event: ToolFinished) -> Decision | None:
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        if "git commit" not in command:
            return None
        head = self.head()
        by = Actor.agent(event.session)
        if not head or self.messages.keyed(f"{COMMIT}:{head.sha}", by):
            return None
        label = f"Agent committed {head.sha[:8]} on `{head.branch}`"
        self.cards.keyed(event.environment_id, f"{COMMIT}:{head.sha}", label, {"kind": "card", "session": event.session, "icon": "branch", "tone": "commit", "detail": head.subject, "shows": "commits"}, by)
        return self.close_named(event, head.sha, head.body)

    def close_named(self, event: ToolFinished, sha: str, body: str) -> Decision | None:
        from journal.features.tasks.feature import Tasks
        numbers = [int(n) for found in TRAILER.finditer(body) for n in re.findall(r"\d+", found.group(1))]
        if not numbers:
            return None
        where = Where(self.environments.find(event.environment_id).name, event.session)
        closed = [n for n in numbers if self.console.run(["task", "done", str(n), "--how", f"commit {sha[:8]}"], where).code == 0]
        if not closed:
            return None
        line = self.nudger.say(self.agents.for_session(event.session), Tasks.CLOSED_BY_COMMIT.about(sha=sha[:8], tasks=", ".join(f"task {n}" for n in closed)))
        return Decision.tell(line) if line else None

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
