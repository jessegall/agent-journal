import re
import subprocess
import time
from pathlib import Path

from journal.config import Config
from journal.console.console import Console
from journal.support.where import Where
from journal.support.cards import Cards
from journal.engine.nudger import Nudger
from journal.events.agent.commit_made import CommitMade
from journal.events.agent.tool_finished import ToolFinished
from journal.events.bus import Bus
from journal.features.git.support.head_commit import HeadCommit
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.support.actor import Actor
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.repositories.tasks import Tasks as TaskRows
from journal.models.task_state import TaskState
from journal.repositories.environments import Environments
from journal.support.worktree import Worktree
from journal.support.chat_mark import ChatMark
from journal.features.tasks.support.after_a_close import AfterAClose

COMMIT = "commit"
JUST_MADE = 60
"""Seconds a commit counts as made by the command that just ran: an older head is another's, and its trailer closes nothing."""
TRAILER = re.compile(r"^Journal: (?:tasks|todos) done ((?:\d+(?:[ ,]+(?:and +)?)?)+)\s*(.*)$", re.MULTILINE)
"""The line, on its own and at column zero, that closes tasks when the commit lands: the numbers, then what was done."""


class SpotCommit(AgentListener[ToolFinished]):
    """A shell command that committed is followed by a look at the head: the commit becomes a card in the chat, once, the bus is told a commit was made, and a Journal: tasks done line in its message finishes those tasks and says so in the reply to that command."""

    blocking = True

    def __init__(self, config: Config, cards: Cards, messages: Messages, console: Console, environments: Environments, agents: Agents, nudger: Nudger, tasks: TaskRows, bus: Bus, after: AfterAClose) -> None:
        self.config, self.cards, self.messages, self.console, self.environments, self.agents, self.nudger, self.tasks, self.bus = config, cards, messages, console, environments, agents, nudger, tasks, bus
        self.after = after

    def handle(self, event: ToolFinished) -> Decision | None:
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        if "git merge" in command:
            return self.merged(event)
        if "git commit" not in command:
            return None
        folder = self.folder(event)
        head = self.head(folder)
        by = Actor.agent(event.session)
        if not head or self.messages.keyed(f"{COMMIT}:{head.sha}", by):
            return None
        label = f"Agent committed {head.sha[:8]} on `{head.branch}`"
        self.cards.keyed(event.environment_id, f"{COMMIT}:{head.sha}", label, {"kind": "card", "session": event.session, "icon": "branch", "tone": "commit", "detail": head.subject}, by, ChatMark.COMMITS)
        self.bus.dispatch(CommitMade(sha=head.sha).placed(event.session, event.environment_id, event.provider, event.context, event.at))
        if folder != self.config.root or time.time() - head.committed > JUST_MADE:
            return None
        return self.close_named(event, head.sha, head.body)

    def folder(self, event: ToolFinished) -> Path:
        tree = Worktree(self.config.root, self.environments.find(event.environment_id).name)
        return tree.path if tree.path.is_dir() else self.config.root

    def merged(self, event: ToolFinished) -> Decision | None:
        landed = subprocess.run(["git", "log", "--format=%H%x00%B%x01", "ORIG_HEAD..HEAD"], cwd=self.config.root, capture_output=True, text=True, timeout=5)
        if landed.returncode != 0:
            return None
        decisions = [self.close_named(event, sha, body) for sha, _, body in (entry.strip().partition("\0") for entry in landed.stdout.split("\x01") if entry.strip())]
        return next((d for d in decisions if d), None)

    def close_named(self, event: ToolFinished, sha: str, body: str) -> Decision | None:
        from journal.features.tasks.feature import Tasks
        numbers = [int(n) for found in TRAILER.finditer(body) for n in re.findall(r"\d+", found.group(1))]
        numbers = [n for n in numbers if self.tasks.where(id=n, state=TaskState.OPEN) or self.tasks.where(id=n, state=TaskState.STARTED)]
        if not numbers:
            return None
        where = Where(self.environments.find(event.environment_id).name, event.session)
        closed = [n for n in numbers if self.console.run(["task", "done", str(n), "--how", f"commit {sha[:8]}"], where).code == 0]
        if not closed:
            return None
        agent = self.agents.for_session(event.session)
        after = self.after.said(self.tasks.find(closed[-1]))
        lines = [self.nudger.say(agent, Tasks.CLOSED_BY_COMMIT.about(sha=sha[:8], tasks=", ".join(f"task {n}" for n in closed))), self.nudger.say(agent, after) if after else None]
        said = "\n".join(line for line in lines if line)
        return Decision.tell(said) if said else None

    def head(self, folder: Path) -> HeadCommit | None:
        try:
            out = subprocess.run(["git", "log", "-1", "--format=%H%n%ct%n%s%n%B"], cwd=folder, capture_output=True, text=True, timeout=5)
            branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=folder, capture_output=True, text=True, timeout=5).stdout.strip()
        except (OSError, subprocess.TimeoutExpired):
            return None
        if out.returncode != 0 or not out.stdout.strip():
            return None
        sha, _, rest = out.stdout.strip().partition("\n")
        committed, _, rest = rest.partition("\n")
        subject, _, body = rest.partition("\n")
        return HeadCommit(sha, subject, branch, body, int(committed))
