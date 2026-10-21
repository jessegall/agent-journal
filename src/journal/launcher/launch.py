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
from journal.launcher.support.foreign_hooks import ForeignHooks
from journal.launcher.support.page_wait import PageWait
from journal.support.project_command import ProjectCommand
from journal.launcher.support.status_line import StatusLine
from journal.support.worktree import Worktree
from journal.launcher.support.update_prompt import UpdatePrompt
from journal.features.updates.support.release_source import ReleaseSource
from journal.config import Config
from journal.providers.claude import Claude
from journal.providers.codex import Codex
from journal.support.private_folder import PrivateFolder

RESUME = {"claude": lambda session: ["--resume", session], "codex": lambda session: ["resume", session]}
PROMPT_FLAGS = {provider.name: list(provider.prompt_flags) for provider in (Claude, Codex)}
STATUS = {"claude": lambda status: ["--settings", status.settings()], "codex": lambda status: []}
LOCAL = {"claude": [], "codex": ["--no-daemon"]}
REACH = {"claude": [], "codex": ["-c", "sandbox_workspace_write.network_access=true"]}
FLAGS = {"--env": 1, "--new": 0, "--aside": 0, "--skip": 0, "--yes": 0, "--no-open": 0, "--no-journal": 0}
WORKTREE = ("--worktree", "-w")
RESUMING = ("--resume", "-r")


@dataclass(frozen=True)
class Launch:
    """What was asked for on the command line: which agent, in which project, with which arguments; the menu fills in the rest."""

    agent: str
    root: Path
    args: tuple[str, ...]
    environment: str = ""
    new: bool = False
    stashed: bool = False
    bypass: bool = False
    confirmed: bool = False
    browser_off: bool = False
    journal_off: bool = False
    worktree: str = ""
    worktree_launch: bool = False

    @classmethod
    def parse(cls, argv: list[str], root: Path) -> "Launch":
        agent, remainder, flags, args, i = argv[0], [], {}, argv[1:], 0
        while i < len(args):
            arg, value = args[i], args[i + 1] if i + 1 < len(args) else ""
            if arg == "--":
                remainder.extend(args[i + 1:])
                break
            if arg in WORKTREE:
                matched = bool(value) and not value.startswith("-")
                flags.update(in_worktree=True, worktree=value if matched else "")
                i += 2 if matched else 1
                continue
            if arg in FLAGS:
                flags[arg.lstrip("-").replace("-", "_")] = value if FLAGS[arg] else True
                i += 2 if FLAGS[arg] else 1
                continue
            remainder.append(arg)
            i += 1
        return cls(agent, root, tuple(remainder), **flags)

    @property
    def package(self) -> Path:
        return Path(__file__).resolve().parents[2]

    def choice(self) -> Choice:
        menu = Menu(self.root, self.package / "journal.py")
        matched = self.environment or self.worktree or self.resume_folder(menu)
        if not sys.stdin.isatty():
            return Choice(matched or "main", "", self.stashed, self.is_skipping())
        subprocess.run(["stty", "sane"], stdin=sys.stdin, check=False)
        if not self.confirmed and UpdatePrompt(Config(self.root), menu.screen, ReleaseSource()).installed_newer():
            self.log("updated before the launch: starting again on the new version")
            os.execv(sys.executable, [sys.executable, *sys.argv])
        return menu.choose(self.agent, matched, self.new, self.stashed, self.is_skipping(), self.confirmed)

    def is_skipping(self) -> bool:
        return self.bypass or any(flag in self.args for flag in PROMPT_FLAGS[self.agent])

    def resume_folder(self, menu: Menu) -> str:
        resumed = next((self.args[i + 1] for i, arg in enumerate(self.args[:-1]) if arg in RESUMING), "")
        if not resumed:
            return ""
        return next((row.name for row in menu.environments() if resumed in row.last_sessions.values()), "")

    def agent_command(self, choice: Choice, status: StatusLine) -> list[str]:
        omit = [flag for flag in PROMPT_FLAGS[self.agent] if choice.prompt_flags and flag not in self.args]
        reach = [] if choice.prompt_flags else REACH[self.agent]
        return [self.agent, *LOCAL[self.agent], *omit, *reach, *STATUS[self.agent](status), *self.args]

    def journal_command(self) -> list[str]:
        return [sys.executable, str(self.package / "journal.py"), "serve"]

    def environ(self, choice: Choice) -> dict[str, str]:
        path = os.pathsep.join([str(self.root / ".journal" / "bin"), os.environ.get("PATH", "")])
        runner = self.package / "journal" / "hooks" / "run.sh"
        return {**os.environ, **self.keys(), "PATH": path, "JOURNAL_ROOT": str(self.root), "JOURNAL_ENV": choice.environment, "AGENT_JOURNAL_ACTIVE": "1", "CLAUDE_CODE_SHELL_PREFIX": str(runner)}

    def keys(self) -> dict[str, str]:
        path = PrivateFolder(self.root).keys_file()
        return {k: str(v) for k, v in json.loads(path.read_text()).items()} if path.is_file() else {}

    def run(self) -> int:
        self.log(f"launch: {' '.join([self.agent, *self.args])}")
        try:
            ProjectCommand(self.root, self.package / "journal.sh").write()
            peers = ForeignHooks(self.root, self.agent)
            peers.restore()
            choice = self.choice()
            self.log(f"chosen: environment {choice.environment}, session {choice.resume or 'new'}, hooks aside {choice.stashed_hooks}")
            if choice.stashed_hooks:
                peers.stash()
            try:
                code = self.supervise(choice)
            finally:
                peers.restore()
            self.log(f"ended: the agent exited with {code}")
            return code
        except BaseException as failed:
            self.log(f"failed: {traceback.format_exc() if not isinstance(failed, KeyboardInterrupt) else 'interrupted'}")
            raise

    def log(self, line: str) -> None:
        path = self.runtime / "supervisor.log"
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a") as output:
            output.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} {line}\n")

    def supervise(self, choice: Choice) -> int:
        status = StatusLine(self.root)
        launch = self.launch_file(choice, status)
        path = self.runtime / "launches" / f"{choice.environment}.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.touch(mode=0o600)
        path.chmod(0o600)
        path.write_text(json.dumps(launch))
        PageWait(self.runtime.parent / "port", launch["socket"], (launch["band"]["left"], launch["band"]["middle"]), "" if self.browser_off else f"?env={choice.environment}", self.log).start()
        try:
            return subprocess.run([sys.executable, "-m", "supervisor", str(path)], cwd=self.root, env={**os.environ, "PYTHONPATH": str(self.package)}).returncode
        finally:
            path.unlink(missing_ok=True)

    def launch_file(self, choice: Choice, status: StatusLine) -> dict:
        environ = self.environ(choice)
        worktree = Worktree(self.root, self.worktree or choice.environment)
        folder = worktree.created() if self.worktree_launch or worktree.path.is_dir() else self.root
        journal = {"name": "journal", "command": self.journal_command(), "folder": str(self.root), "env": environ, "log": str(self.runtime / "server.log")}
        return {
            "front": {"command": self.agent_command(choice, status), "resume": RESUME[self.agent](choice.resume) if choice.resume else [], "folder": str(folder), "env": environ},
            "services": [] if self.journal_off else [journal],
            "socket": str(self.socket(choice.environment)),
            "announce": str(self.runtime / "inboxes" / choice.environment),
            "screen": str(self.runtime / "screens" / f"{choice.environment}.out"),
            "band": {"left": "agent-journal", "middle": f"{self.root.name} · {choice.environment}", "right": "journal starting…"},
        }

    def socket(self, environment: str) -> Path:
        key = hashlib.sha1(str(self.root.resolve()).encode()).hexdigest()[:12]
        slug = re.sub(r"[^A-Za-z0-9_-]", "-", environment)[:24]
        return Path("/tmp") / f"journal-{os.getuid()}" / f"{key}-{slug}.sock"

    @property
    def runtime(self) -> Path:
        return self.root / ".journal" / "runtime"
