import os
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

from supervisor.inbox import Inbox
from supervisor.journal_process import JournalProcess
from supervisor.choice import Choice
from supervisor.menu import Menu
from supervisor.supervisor import Supervisor
from supervisor.terminal import Terminal

RESUME = {"claude": lambda session: ["--resume", session], "codex": lambda session: ["resume", session]}
SKIP = {"claude": ["--dangerously-skip-permissions"], "codex": ["--dangerously-bypass-approvals-and-sandbox"]}
FLAGS = {"--env": 1, "--new": 0, "--aside": 0, "--skip": 0, "--yes": 0, "--no-open": 0}


@dataclass(frozen=True)
class Launch:
    """What was asked for on the command line: which agent, in which project, with which arguments; the menu fills in the rest."""

    agent: str
    root: Path
    args: tuple[str, ...]
    env: str = ""
    new: bool = False
    aside: bool = False
    skip: bool = False
    yes: bool = False
    no_open: bool = False

    @classmethod
    def parse(cls, argv: list[str], root: Path) -> "Launch":
        agent, rest, flags = argv[0], [], {}
        it = iter(argv[1:])
        for arg in it:
            if arg == "--":
                rest.extend(it)
            elif arg in FLAGS:
                flags[arg.lstrip("-").replace("-", "_")] = next(it) if FLAGS[arg] else True
            else:
                rest.append(arg)
        return cls(agent, root, tuple(rest), **flags)

    @property
    def package(self) -> Path:
        return Path(__file__).resolve().parents[1]

    def choice(self) -> Choice:
        if not sys.stdin.isatty():
            return Choice(self.env or "main", "", self.aside, self.skip)
        subprocess.run(["stty", "sane"], stdin=sys.stdin, check=False)
        return Menu(self.root, self.package / "journal.py").choose(self.agent, self.env, self.new, self.aside, self.skip, self.yes)

    def agent_command(self, choice: Choice) -> list[str]:
        resume = RESUME[self.agent](choice.resume) if choice.resume else []
        skip = [flag for flag in SKIP[self.agent] if choice.skip_prompts and flag not in self.args]
        return [self.agent, *resume, *skip, *self.args]

    def journal_command(self) -> list[str]:
        return [sys.executable, str(self.package / "journal.py"), "serve"]

    def environ(self, choice: Choice) -> dict[str, str]:
        shared = {**os.environ, "JOURNAL_ROOT": str(self.root), "JOURNAL_ENV": choice.environment, "JOURNAL_INBOX": str(Inbox.path_for(self.root))}
        if choice.hooks_aside:
            shared.pop("AGENT_JOURNAL_ACTIVE", None)
            return shared
        return {**shared, "AGENT_JOURNAL_ACTIVE": "1"}

    def supervisor(self) -> Supervisor:
        choice = self.choice()
        environ = self.environ(choice)
        terminal = Terminal(self.agent_command(choice), str(self.root), environ)
        journal = JournalProcess(self.root, self.journal_command(), environ, self.root / ".journal" / "runtime" / "server.log")
        return Supervisor(terminal, Inbox(Inbox.path_for(self.root)), journal, viewer="" if self.no_open else f"#/{choice.environment}")
