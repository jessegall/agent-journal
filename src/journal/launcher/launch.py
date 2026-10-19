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

from journal.launcher.support.choice import Choice
from journal.launcher.menu import Menu
from journal.launcher.support.other_hooks import OtherHooks
from journal.launcher.support.page_wait import PageWait
from journal.support.project_command import ProjectCommand
from journal.launcher.support.status_line import StatusLine
from journal.support.worktree import Worktree
from journal.launcher.support.update_offer import UpdateOffer
from journal.features.updates.support.release_source import ReleaseSource
from journal.config import Config
from journal.support.private_folder import PrivateFolder

RESUME = {"claude": lambda session: ["--resume", session], "codex": lambda session: ["resume", session]}
SKIP = {"claude": ["--dangerously-skip-permissions"], "codex": ["--dangerously-bypass-approvals-and-sandbox"]}
STATUS = {"claude": lambda status: ["--settings", status.settings()], "codex": lambda status: []}
REACH = {"claude": [], "codex": ["-c", "sandbox_workspace_write.network_access=true"]}
"""What a sandboxed agent needs to reach its journal's server on this machine."""
FLAGS = {"--env": 1, "--new": 0, "--aside": 0, "--skip": 0, "--yes": 0, "--no-open": 0, "--no-journal": 0}
WORKTREE = ("--worktree", "-w")
RESUMING = ("--resume", "-r")
"""A conversation named on the command line, run where it last ran: its environment, and that environment's worktree."""
"""The worktree flag, its name optional: bare, the worktree takes the chosen environment's name."""
"""A flag's field when it is not the flag's own name."""


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
    worktree: str = ""
    """The worktree the agent works in, the journal's to make and keep; Claude Code never sees the flag, since it removes a worktree it made when it exits."""
    in_worktree: bool = False

    @classmethod
    def parse(cls, argv: list[str], root: Path) -> "Launch":
        agent, rest, flags, args, i = argv[0], [], {}, argv[1:], 0
        while i < len(args):
            arg, given = args[i], args[i + 1] if i + 1 < len(args) else ""
            if arg == "--":
                rest.extend(args[i + 1:])
                break
            if arg in WORKTREE:
                named = bool(given) and not given.startswith("-")
                flags.update(in_worktree=True, worktree=given if named else "")
                i += 2 if named else 1
                continue
            if arg in FLAGS:
                flags[arg.lstrip("-").replace("-", "_")] = given if FLAGS[arg] else True
                i += 2 if FLAGS[arg] else 1
                continue
            rest.append(arg)
            i += 1
        return cls(agent, root, tuple(rest), **flags)

    @property
    def package(self) -> Path:
        return Path(__file__).resolve().parents[2]

    def choice(self) -> Choice:
        menu = Menu(self.root, self.package / "journal.py")
        named = self.env or self.worktree or self.resumed_in(menu)
        if not sys.stdin.isatty():
            return Choice(named or "main", "", self.aside, self.is_skipping())
        subprocess.run(["stty", "sane"], stdin=sys.stdin, check=False)
        if not self.yes and UpdateOffer(Config(self.root), menu.screen, ReleaseSource()).installed_newer():
            self.log("updated before the launch: starting again on the new version")
            os.execv(sys.executable, [sys.executable, *sys.argv])
        return menu.choose(self.agent, named, self.new, self.aside, self.is_skipping(), self.yes)

    def is_skipping(self) -> bool:
        return self.skip or any(flag in self.args for flag in SKIP[self.agent])

    def resumed_in(self, menu: Menu) -> str:
        resumed = next((self.args[i + 1] for i, arg in enumerate(self.args[:-1]) if arg in RESUMING), "")
        if not resumed:
            return ""
        return next((row.name for row in menu.environments() if resumed in row.last_sessions.values()), "")

    def agent_command(self, choice: Choice, status: StatusLine) -> list[str]:
        """The agent's command without the arguments that resume a conversation, which the launch file carries apart so a restart can replace them."""
        skip = [flag for flag in SKIP[self.agent] if choice.skip_prompts and flag not in self.args]
        reach = [] if choice.skip_prompts else REACH[self.agent]
        return [self.agent, *skip, *reach, *STATUS[self.agent](status), *self.args]

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
        PageWait(self.runtime.parent / "port", status, launch["socket"], (launch["band"]["left"], launch["band"]["middle"]), "" if self.no_open else f"?env={choice.environment}", self.log).start()
        try:
            return subprocess.run([sys.executable, "-m", "supervisor", str(path)], cwd=self.root, env={**os.environ, "PYTHONPATH": str(self.package)}).returncode
        finally:
            path.unlink(missing_ok=True)

    def launch_file(self, choice: Choice, status: StatusLine) -> dict:
        """What the supervisor starts: the agent in front, the journal beside it unless one runs already, its socket, announce file and mirror, and the band's words."""
        environ = self.environ(choice)
        worktree = Worktree(self.root, self.worktree or choice.environment)
        folder = worktree.made() if self.in_worktree or worktree.path.is_dir() else self.root
        journal = {"name": "journal", "command": self.journal_command(), "folder": str(self.root), "env": environ, "log": str(self.runtime / "server.log")}
        return {
            "front": {"command": self.agent_command(choice, status), "resume": RESUME[self.agent](choice.resume) if choice.resume else [], "folder": str(folder), "env": environ},
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
