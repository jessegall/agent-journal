import json
import os
from datetime import datetime
import traceback
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

from supervisor.header import Header
from supervisor.inbox import Inbox
from supervisor.journal_process import JournalProcess
from supervisor.choice import Choice
from supervisor.status_line import StatusLine
from supervisor.menu import Menu
from supervisor.no_journal import NoJournal
from supervisor.other_hooks import OtherHooks
from supervisor.project_command import ProjectCommand
from supervisor.supervisor import Supervisor
from supervisor.terminal import Terminal

RESUME = {"claude": lambda session: ["--resume", session], "codex": lambda session: ["resume", session]}
SKIP = {"claude": ["--dangerously-skip-permissions"], "codex": ["--dangerously-bypass-approvals-and-sandbox"]}
STATUS = {"claude": lambda status: ["--settings", status.settings()], "codex": lambda status: []}
FLAGS = {"--env": 1, "--new": 0, "--aside": 0, "--skip": 0, "--yes": 0, "--no-open": 0, "--no-journal": 0}


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
    no_journal: bool = False
    """Started by a journal already running: no server of its own."""

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

    def agent_command(self, choice: Choice, status: StatusLine) -> list[str]:
        resume = RESUME[self.agent](choice.resume) if choice.resume else []
        skip = [flag for flag in SKIP[self.agent] if choice.skip_prompts and flag not in self.args]
        return [self.agent, *resume, *skip, *STATUS[self.agent](status), *self.args]

    def journal_command(self) -> list[str]:
        return [sys.executable, str(self.package / "journal.py"), "serve"]

    def environ(self, choice: Choice) -> dict[str, str]:
        path = os.pathsep.join([str(self.root / ".journal" / "bin"), os.environ.get("PATH", "")])
        runner = self.package / "journal" / "hooks" / "run.sh"
        return {**os.environ, **self.keys(), "PATH": path, "JOURNAL_ROOT": str(self.root), "JOURNAL_ENV": choice.environment, "AGENT_JOURNAL_ACTIVE": "1", "CLAUDE_CODE_SHELL_PREFIX": str(runner)}

    def keys(self) -> dict[str, str]:
        """The keys the project's MCP servers sign in with, kept by the journal in the home folder and handed to the agent as environment variables."""
        path = Path.home() / ".journal" / "keys" / f"{str(self.root.resolve()).strip('/').replace('/', '-')}.json"
        return {k: str(v) for k, v in json.loads(path.read_text()).items()} if path.is_file() else {}

    def run(self) -> int:
        """Asks, sets the other hooks aside when so chosen, runs the agent under the supervisor, and puts the hooks back however it ends. What happened is written to .journal/runtime/supervisor.log, so a launch that ends at once can be read back."""
        self.log(f"launch: {' '.join([self.agent, *self.args])}")
        try:
            ProjectCommand(self.root, self.package / "journal.sh").write()
            others = OtherHooks(self.root, self.agent)
            others.put_back()
            choice = self.choice()
            self.log(f"chosen: environment {choice.environment}, session {choice.resume or 'new'}, hooks aside {choice.hooks_aside}")
            if choice.hooks_aside:
                others.set_aside()
            try:
                code = self.supervisor(choice).run()
            finally:
                others.put_back()
            self.log(f"ended: the agent exited with {code}")
            return code
        except BaseException as failed:
            self.log(f"failed: {traceback.format_exc() if not isinstance(failed, KeyboardInterrupt) else 'interrupted'}")
            raise

    def log(self, line: str) -> None:
        path = self.root / ".journal" / "runtime" / "supervisor.log"
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a") as out:
            out.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} {line}\n")

    def supervisor(self, choice: Choice) -> Supervisor:
        environ = self.environ(choice)
        status = StatusLine(self.root.name, choice.environment, self.root)
        terminal = Terminal(self.agent_command(choice, status), str(self.root), environ)
        journal = NoJournal(self.root) if self.no_journal else JournalProcess(self.root, self.journal_command(), environ, self.root / ".journal" / "runtime" / "server.log")
        header = Header(self.root.name, choice.environment) if sys.stdout.isatty() else None
        return Supervisor(terminal, Inbox.for_(self.root, choice.environment), journal, status, stdin=0 if sys.stdin.isatty() else None, viewer="" if self.no_open else f"#/{choice.environment}", header=header)
