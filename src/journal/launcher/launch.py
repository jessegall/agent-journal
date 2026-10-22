import hashlib
import json
import os
import re
import subprocess
import sys
import traceback
import uuid
from datetime import datetime
from dataclasses import dataclass
from pathlib import Path

from journal.support.choice import Choice
from journal.launcher.menu import Menu
from journal.launcher.support.foreign_hooks import ForeignHooks
from journal.launcher.support.page_wait import PageWait
from journal.support.project_command import ProjectCommand
from journal.providers.support.status_line import StatusLine
from journal.support.worktree import Worktree
from journal.launcher.support.update_prompt import UpdatePrompt
from journal.features.updates.support.release_source import ReleaseSource
from journal.config import Config
from journal.sync.team_account import PREFIX_FILE, TEAM_FILE
from journal.providers.provider import Provider
from journal.providers.providers import Providers
from journal.support.private_folder import PrivateFolder

ENVIRONMENT = "--env"
SWITCHES = {"--new": "new", "--aside": "stashed", "--skip": "bypass", "--yes": "confirmed", "--no-open": "browser_off", "--no-journal": "journal_off"}
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
        agent, args, i = argv[0], argv[1:], 0
        remainder: list[str] = []
        switches: set[str] = set()
        environment, worktree, worktree_launch = "", "", False
        while i < len(args):
            arg, value = args[i], args[i + 1] if i + 1 < len(args) else ""
            if arg == "--":
                remainder.extend(args[i + 1:])
                break
            if arg in WORKTREE:
                matched = bool(value) and not value.startswith("-")
                worktree_launch, worktree = True, value if matched else ""
                i += 2 if matched else 1
                continue
            if arg == ENVIRONMENT:
                environment, i = value, i + 2
                continue
            if arg in SWITCHES:
                switches.add(SWITCHES[arg])
                i += 1
                continue
            remainder.append(arg)
            i += 1
        return cls(agent, root, tuple(remainder), environment, "new" in switches, "stashed" in switches, "bypass" in switches, "confirmed" in switches, "browser_off" in switches, "journal_off" in switches, worktree, worktree_launch)

    @property
    def provider(self) -> Provider:
        return Providers().lookup(self.agent)

    @property
    def package(self) -> Path:
        return Path(__file__).resolve().parents[2]

    def choice(self) -> Choice:
        menu = Menu(self.root, self.package / "journal.py")
        matched = self.environment or self.worktree or self.resume_folder(menu)
        if not sys.stdin.isatty():
            menu.environment_rows(matched or self.default_environment(), menu.environments())
            return Choice(matched or self.default_environment(), "", self.stashed, self.is_skipping())
        subprocess.run(["stty", "sane"], stdin=sys.stdin, check=False)
        if not self.confirmed and UpdatePrompt(Config(self.root), menu.screen, ReleaseSource()).installed_newer():
            self.log("updated before the launch: starting again on the new version")
            os.execv(sys.executable, [sys.executable, *sys.argv])
        return menu.choose(self.agent, matched, self.new, self.stashed, self.is_skipping(), self.confirmed)

    def is_worktree_launch(self, worktree: Worktree) -> bool:
        return self.worktree_launch or worktree.path.is_dir() or self.is_shared()

    def is_shared(self) -> bool:
        return (self.root / ".journal" / TEAM_FILE).is_file()

    def default_environment(self) -> str:
        prefix_file = self.root / ".journal" / PREFIX_FILE
        return f"{prefix_file.read_text().strip()}-main" if prefix_file.is_file() else "main"

    def start_refusal(self, choice: Choice) -> str:
        return next((row.refusal for row in Menu(self.root, self.package / "journal.py").environments() if row.name == choice.environment), "")

    def is_skipping(self) -> bool:
        return self.bypass or any(flag in self.args for flag in self.provider.prompt_flags)

    def resume_folder(self, menu: Menu) -> str:
        resumed = next((self.args[i + 1] for i, arg in enumerate(self.args[:-1]) if arg in RESUMING), "")
        if not resumed:
            return ""
        return next((row.name for row in menu.environments() if resumed in row.last_sessions.values()), "")

    def agent_command(self, choice: Choice, status: StatusLine) -> list[str]:
        return self.provider.interactive_command(choice, status, self.args)

    def journal_command(self) -> list[str]:
        return [sys.executable, str(self.package / "journal.py"), "serve"]

    def environ(self, choice: Choice, launch: str) -> dict[str, str]:
        path = os.pathsep.join([str(self.root / ".journal" / "bin"), os.environ.get("PATH", "")])
        runner = self.package / "journal" / "hooks" / "run.sh"
        return {**os.environ, **self.keys(), **self.provider.launch_environment(runner), "PATH": path, "JOURNAL_ROOT": str(self.root), "JOURNAL_ENV": choice.environment, "JOURNAL_LAUNCH": launch, "AGENT_JOURNAL_ACTIVE": "1"}

    def keys(self) -> dict[str, str]:
        path = PrivateFolder(self.root).keys_file()
        return {k: str(v) for k, v in json.loads(path.read_text()).items()} if path.is_file() else {}

    def run(self) -> int:
        self.log(f"launch: {' '.join([self.agent, *self.args])}")
        try:
            ProjectCommand(self.root, self.package / "journal.sh").write()
            peers = ForeignHooks(self.root, self.provider)
            peers.restore()
            choice = self.choice()
            refusal = self.start_refusal(choice)
            if refusal:
                self.log(f"refused: {refusal}")
                print(refusal, file=sys.stderr)
                return 1
            self.log(f"chosen: environment {choice.environment}, session {choice.resume or 'new'}, hooks aside {choice.stashed_hooks}")
            if choice.stashed_hooks:
                peers.stash()
            try:
                code = self.supervise(choice)
            finally:
                peers.restore()
            self.log(f"ended: the supervisor's loop exited with {code}")
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
            return subprocess.run(["sh", str(self.package / "supervisor" / "launcher.sh"), sys.executable, str(path)], cwd=self.root).returncode
        finally:
            path.unlink(missing_ok=True)

    def launch_file(self, choice: Choice, status: StatusLine) -> dict:
        launch = uuid.uuid4().hex
        environ = self.environ(choice, launch)
        worktree = Worktree(self.root, self.worktree or choice.environment)
        folder = worktree.created() if self.is_worktree_launch(worktree) else self.root
        if folder != self.root:
            Menu(self.root, self.package / "journal.py").journal("environment", "branch", choice.environment, worktree.branch)
        journal = {"name": "journal", "command": self.journal_command(), "folder": str(self.root), "env": environ, "log": str(self.runtime / "server.log")}
        return {
            "launch": launch,
            "front": {"command": self.agent_command(choice, status), "resume": list(self.provider.resume(choice.resume)) if choice.resume else [], "folder": str(folder), "env": environ},
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
