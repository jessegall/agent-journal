import re
import subprocess
import time as timing
from pathlib import Path

from journal.config import Config
from journal.console.console import Console
from journal.support.caller import Caller
from journal.support.cards import Cards
from journal.events.agent.commit_detected import CommitDetected
from journal.events.agent.tool_finished import ToolFinished
from journal.events.bus import Bus
from journal.features.git.support.head_commit import HeadCommit
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.messages import Messages
from journal.repositories.tasks import Tasks as TaskRows
from journal.models.task_state import TaskState
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.support.worktree import Worktree
from journal.support.card_kind import CardKind
from journal.features.tasks.support.next_open_task import NextOpenTask
from journal.support.decision import Decision

COMMIT = "commit"
COMMIT_WINDOW_SECONDS = 60
LAST_STARTS = 3
TRAILER = re.compile(r"^Journal: (?:tasks|todos) done ((?:\d+(?:[ ,]+(?:and +)?)?)+)\s*(.*)$", re.MULTILINE)


class CommitDetection(AgentListener[ToolFinished]):
    """A shell command that committed is followed by a look at the head: the commit becomes a card in the chat, once, a Journal: tasks done line in its message finishes those tasks, and the bus is told a commit was made with what it closed; what the agent is told of it is the git conduct's, handed back with the command's own answer. A commit whose own hook never came, lost to an install or a restart in the same line, is spotted at the next tool use by the head's log having moved, and its tasks close when one of the session's last tool starts held the commit."""

    blocking = True

    def __init__(self, config: Config, cards: Cards, messages: Messages, console: Console, environments: Environments, tasks: TaskRows, bus: Bus, next_task: NextOpenTask, entries: Entries) -> None:
        self.config, self.cards, self.messages, self.console, self.environments, self.tasks, self.bus = config, cards, messages, console, environments, tasks, bus
        self.next_task, self.entries = next_task, entries
        self._head_log_times: dict[Path, float] = {}

    def handle(self, event: ToolFinished) -> Decision | None:
        texts = [part.text for part in event.call.parts]
        if any(text.startswith("git merge") for text in texts):
            return self.merged(event)
        folder = self.folder(event)
        if not any(text.startswith("git commit") for text in texts) and not self.head_moved(folder):
            return None
        head = self.head(folder)
        actor = Actor.agent(event.session)
        if not head or self.messages.keyed(f"{COMMIT}:{head.sha}", actor):
            return None
        label = f"Agent committed {head.sha[:8]} on `{head.branch}`"
        self.cards.keyed(event.environment_id, f"{COMMIT}:{head.sha}", label, {"kind": "card", "session": event.session, "icon": "branch", "tone": "commit", "detail": head.subject}, actor, CardKind.COMMITS)
        closed = self.close_named(event, head.sha, head.body) if folder == self.config.root and self.is_own(event, head) else []
        return self.commit(event, head.sha, closed)

    def is_own(self, event: ToolFinished, head: HeadCommit) -> bool:
        if timing.time() - head.committed <= COMMIT_WINDOW_SECONDS:
            return True
        starts = self.entries.tool_starts(event.session, last=LAST_STARTS)
        return any(part["text"].startswith("git commit") for start in starts for part in start.data.get("call", {}).get("parts", []))

    def head_moved(self, folder: Path) -> bool:
        log = self.head_log(folder)
        try:
            moment = log.stat().st_mtime
        except OSError:
            return False
        known = self._head_log_times.get(folder)
        self._head_log_times[folder] = moment
        return known is not None and moment != known

    @staticmethod
    def head_log(folder: Path) -> Path:
        git = folder / ".git"
        if git.is_file():
            return Path(git.read_text().strip().removeprefix("gitdir:").strip()) / "logs" / "HEAD"
        return git / "logs" / "HEAD"

    def commit(self, event: ToolFinished, sha: str, closed: list[int]) -> Decision | None:
        next_open = self.next_task.after(self.tasks.find(closed[-1])) if closed else None
        commit = CommitDetected(sha=sha, closed=tuple(closed), next_open=next_open).placed(event.session, event.environment_id, event.provider, event.context, event.time)
        return next((answer for answer in self.bus.dispatch(commit) if isinstance(answer, Decision)), None)

    def folder(self, event: ToolFinished) -> Path:
        tree = Worktree(self.config.root, self.environments.find(event.environment_id).name)
        return tree.path if tree.path.is_dir() else self.config.root

    def merged(self, event: ToolFinished) -> Decision | None:
        landed = subprocess.run(["git", "log", "--format=%H%x00%B%x01", "ORIG_HEAD..HEAD"], cwd=self.config.root, capture_output=True, text=True, timeout=5)
        if landed.returncode != 0:
            return None
        decisions = [self.commit(event, sha, closed) for sha, _, body in (entry.strip().partition("\0") for entry in landed.stdout.split("\x01") if entry.strip()) if (closed := self.close_named(event, sha, body))]
        return next((decision for decision in decisions if decision), None)

    def close_named(self, event: ToolFinished, sha: str, body: str) -> list[int]:
        numbers = [int(n) for rows in TRAILER.finditer(body) for n in re.findall(r"\d+", rows.group(1))]
        numbers = [n for n in numbers if self.tasks.matching(id=n, state=TaskState.OPEN) or self.tasks.matching(id=n, state=TaskState.STARTED)]
        caller = Caller(self.environments.find(event.environment_id).name, event.session)
        return [n for n in numbers if self.console.run(["task", "done", str(n), "--how", f"commit {sha[:8]}"], caller).code == 0]

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
