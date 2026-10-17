import hashlib
import json
import os
import re
import subprocess
import sys
import traceback
from datetime import datetime
from dataclasses import dataclass
from pathlib import Path

from journal.launcher.choice import Choice
from journal.launcher.menu import Menu
from journal.launcher.other_hooks import OtherHooks
from journal.launcher.page_wait import PageWait
from journal.launcher.project_command import ProjectCommand
from journal.launcher.status_line import StatusLine
from journal.private_folder import PrivateFolder

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
        return Path(__file__).resolve().parents[2]

    def choice(self) -> Choice:
        if not sys.stdin.isatty():
            return Choice(self.env or "main", "", self.aside, self.skip)
        subprocess.run(["stty", "sane"], stdin=sys.stdin, check=False)
        return Menu(self.root, self.package / "journal.py").choose(self.agent, self.env, self.new, self.aside, self.skip, self.yes)

    def agent_command(self, choice: Choice, status: StatusLine) -> list[str]:
        """The agent's command without the arguments that resume a conversation, which the launch file carries apart so a restart can replace them."""
        skip = [flag for flag in SKIP[self.agent] if choice.skip_prompts and flag not in self.args]
        return [self.agent, *skip, *STATUS[self.agent](status), *self.args]

    def journal_command(self) -> list[str]:
        return [sys.executable, str(self.package / "journal.py"), "serve"]

    def environ(self, choice: Choice) -> dict[str, str]:
        path = os.pathsep.join([str(self.root / ".journal" / "bin"), os.environ.get("PATH", "")])
        runner = self.package / "journal" / "hooks" / "run.sh"
        return {**os.environ, **self.keys(), "PATH": path, "JOURNAL_ROOT": str(self.root), "JOURNAL_ENV": choice.environment, "AGENT_JOURNAL_ACTIVE": "1", "CLAUDE_CODE_SHELL_PREFIX": str(runner)}

    def keys(self) -> dict[str, str]:
        """The keys the project's MCP servers sign in with, kept by the journal in the home folder and handed to the agent as environment variables."""
        path = PrivateFolder(self.root).keys_file()
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
                code = self.supervise(choice)
            finally:
                others.put_back()
            self.log(f"ended: the agent exited with {code}")
            return code
        except BaseException as failed:
            self.log(f"failed: {traceback.format_exc() if not isinstance(failed, KeyboardInterrupt) else 'interrupted'}")
            raise

    def log(self, line: str) -> None:
        path = self.runtime / "supervisor.log"
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a") as out:
            out.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} {line}\n")

    def supervise(self, choice: Choice) -> int:
        """The supervisor run as a process of its own from the launch file, this process waiting on it and watching for the journal's page meanwhile; the file holds the agent's keys, so only its user reads it, and it goes when the supervisor ends."""
        status = StatusLine(self.root.name, choice.environment, self.root)
        status.begin()
        launch = self.launch_file(choice, status)
        path = self.runtime / "launches" / f"{choice.environment}.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.touch(mode=0o600)
        path.chmod(0o600)
        path.write_text(json.dumps(launch))
        PageWait(self.runtime.parent / "port", status, launch["socket"], (launch["band"]["left"], launch["band"]["middle"]), "" if self.no_open else f"?env={choice.environment}").start()
        try:
            return subprocess.run([sys.executable, "-m", "supervisor", str(path)], cwd=self.root, env={**os.environ, "PYTHONPATH": str(self.package)}).returncode
        finally:
            path.unlink(missing_ok=True)

    def launch_file(self, choice: Choice, status: StatusLine) -> dict:
        """What the supervisor starts: the agent in front, the journal beside it unless one runs already, its socket, announce file and mirror, and the band's words."""
        environ = self.environ(choice)
        journal = {"name": "journal", "command": self.journal_command(), "folder": str(self.root), "env": environ, "log": str(self.runtime / "server.log")}
        return {
            "front": {"command": self.agent_command(choice, status), "resume": RESUME[self.agent](choice.resume) if choice.resume else [], "folder": str(self.root), "env": environ},
            "services": [] if self.no_journal else [journal],
            "socket": str(self.socket(choice.environment)),
            "announce": str(self.runtime / "inboxes" / choice.environment),
            "screen": str(self.runtime / "screens" / f"{choice.environment}.out"),
            "band": {"left": "agent-journal", "middle": f"{self.root.name} · {choice.environment}", "right": "journal starting…"},
        }

    def socket(self, environment: str) -> Path:
        """The supervisor's socket, in a folder of its user's under /tmp, named by the project and the environment so two never meet."""
        key = hashlib.sha1(str(self.root.resolve()).encode()).hexdigest()[:12]
        slug = re.sub(r"[^A-Za-z0-9_-]", "-", environment)[:24]
        return Path("/tmp") / f"journal-{os.getuid()}" / f"{key}-{slug}.sock"

    @property
    def runtime(self) -> Path:
        return self.root / ".journal" / "runtime"
