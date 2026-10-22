import re
import subprocess
import time as timing
from journal.models.support.worker_task import WorkerTask
from pathlib import Path

from journal.config import Config
from journal.console.console import Console
from journal.support.caller import Caller
from journal.chat.cards import Cards
from journal.events.agent.commit_detected import CommitDetected
from journal.events.agent.tool_finished import ToolFinished
from journal.hooks.agent_event_post import AgentEventPost
from journal.features.git.support.head_commit import FORMAT, HeadCommit
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
RECENT_TOOL_STARTS = 3
TRAILER = re.compile(r"^Journal: (?:tasks|todos) done ((?:\d+(?:[ ,]+(?:and +)?)?)+)\s*(.*)$", re.MULTILINE)


class CommitDetection(AgentListener[ToolFinished]):
    """A shell command that committed is followed by a look at the head: the commit becomes a card in the chat, once, a Journal: tasks done line in its message finishes those tasks, and the bus is told a commit was made with what it closed; what the agent is told of it is the git conduct's, handed back with the command's own answer. A commit whose own hook never came, lost to an install or a restart in the same line, is spotted at the next tool use by the head's log having moved, and its tasks close when one of the session's last tool starts held the commit."""

    blocking = True

    def __init__(self, config: Config, cards: Cards, messages: Messages, console: Console, environments: Environments, tasks: TaskRows, events: AgentEventPost, next_task: NextOpenTask, entries: Entries) -> None:
        self.config, self.cards, self.messages, self.console, self.environments, self.tasks, self.events = config, cards, messages, console, environments, tasks, events
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
        self.cards.keyed(event.environment_id, f"{COMMIT}:{head.sha}", label, {"kind": "card", "session": event.session, "icon": "branch", "tone": "commit"}, actor, CardKind.COMMITS, head.subject)
        return self.commit(event, head.sha, head.body if folder == self.config.root and self.is_agents(event, head) else "")

    def is_agents(self, event: ToolFinished, head: HeadCommit) -> bool:
        if timing.time() - head.committed <= COMMIT_WINDOW_SECONDS:
            return True
        starts = self.entries.tool_starts(event.session, last=RECENT_TOOL_STARTS)
        return any(part.text.startswith("git commit") for start in starts for part in start.recorded_call().parts)

    def head_moved(self, folder: Path) -> bool:
        log = self.head_log(folder)
        try:
            moment = log.stat().st_mtime
        except OSError:
            return False
        existing = self._head_log_times.get(folder)
        self._head_log_times[folder] = moment
        return existing is not None and moment != existing

    @staticmethod
    def head_log(folder: Path) -> Path:
        git = folder / ".git"
        if git.is_file():
            return Path(git.read_text().strip().removeprefix("gitdir:").strip()) / "logs" / "HEAD"
        return git / "logs" / "HEAD"

    def commit(self, event: ToolFinished, sha: str, body: str) -> Decision | None:
        numbers, owners = self.trailer_tasks(body), self.tasks.worker_holdings()
        worker_tasks = tuple(WorkerTask(n, owners[n]) for n in numbers if n in owners)
        completions = self.completions(event, sha, [n for n in numbers if n not in owners])
        next_open = self.next_task.following(self.tasks.find(completions[-1])) if completions else None
        commit = CommitDetected(sha=sha, closed=tuple(completions), next_open=next_open, worker_tasks=worker_tasks).placed(event.session, event.environment_id, event.provider, event.context, event.time)
        return next((answer for answer in self.events.post(commit) if isinstance(answer, Decision)), None)

    def folder(self, event: ToolFinished) -> Path:
        tree = Worktree(self.config.root, self.environments.find(event.environment_id).name)
        return tree.path if tree.path.is_dir() else self.config.root

    def merged(self, event: ToolFinished) -> Decision | None:
        delivered = subprocess.run(["git", "log", "--format=%H%x00%B%x01", "ORIG_HEAD..HEAD"], cwd=self.config.root, capture_output=True, text=True, timeout=5)
        if delivered.returncode != 0:
            return None
        decisions = [self.commit(event, sha, body) for sha, _, body in (entry.strip().partition("\0") for entry in delivered.stdout.split("\x01") if entry.strip()) if self.trailer_tasks(body)]
        return next((decision for decision in decisions if decision), None)

    def trailer_tasks(self, body: str) -> list[int]:
        numbers = [int(n) for rows in TRAILER.finditer(body) for n in re.findall(r"\d+", rows.group(1))]
        return [n for n in numbers if self.tasks.matching(id=n, state=TaskState.OPEN) or self.tasks.matching(id=n, state=TaskState.STARTED)]

    def completions(self, event: ToolFinished, sha: str, numbers: list[int]) -> list[int]:
        caller = Caller.agent(self.environments.find(event.environment_id).name, event.session, event.provider)
        return [n for n in numbers if self.console.run(["task", "complete", str(n), "--how", f"commit {sha[:8]}"], caller).code == 0]

    def head(self, folder: Path) -> HeadCommit | None:
        try:
            output = subprocess.run(["git", "log", "-1", f"--format={FORMAT}"], cwd=folder, capture_output=True, text=True, timeout=5)
        except (OSError, subprocess.TimeoutExpired):
            return None
        if output.returncode != 0 or not output.stdout.strip():
            return None
        return HeadCommit.parsed(output.stdout)
