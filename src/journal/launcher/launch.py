import hashlib
import json
import os
import signal
import re
import subprocess
import sys
import traceback
import uuid
from datetime import datetime
from dataclasses import dataclass, replace
from pathlib import Path

from journal.support.process_check import ProcessCheck
from journal.support.choice import Choice
from journal.launcher.menu import Menu
from journal.launcher.support.foreign_hooks import ForeignHooks
from journal.launcher.support.page_wait import PageWait
from journal.support.project_command import ProjectCommand
from journal.providers.support.status_line import StatusLine
from journal.support.worktree import Worktree
from journal.support.worktree_names import WorktreeNames
from journal.support.workspace_worktree import WorkspaceWorktree
from journal.support.worktree_failure import WorktreeFailure
from journal.providers.provider import HOOK_SCRIPT
from journal.launcher.support.update_prompt import UpdatePrompt
from journal.features.updates.support.release_check_memory import ReleaseCheckMemory
from journal.features.updates.support.release_source import ReleaseSource
from journal.support.time_source import TimeSource
from journal.config import Config
from journal.providers.provider import Provider
from journal.providers.providers import Providers
from journal.support.private_folder import PrivateFolder

ENVIRONMENT = "--env"
SWITCHES = {"--new": "new", "--aside": "stashed", "--skip": "bypass", "--yes": "confirmed", "--no-open": "browser_off", "--no-journal": "journal_off"}
WORKTREE = ("--worktree", "-w")
MAIN_WORKTREE_REFUSAL = "main is the project's own checkout, never a worktree: give --worktree another name, or leave the name out for a made-up one"
RESUMING = ("--resume", "-r")
# the journal server is checked at its health URL once its boot has had a minute, and started again after three failures in a row,
# unless the Health and backups settings name other numbers
JOURNAL_HEALTH = {"url": "http://127.0.0.1:{port}/journal/health", "grace_seconds": 60.0, "interval_seconds": 10.0, "timeout_seconds": 5.0, "failures": 3}
from journal.engine.boot_notices import BOOT_NOTICE, BOOT_SECONDS

# the flags that name a conversation to carry on, whose environment and worktree a bare --worktree then takes
RESUME_FLAGS = {"--resume", "-r", "--continue", "-c"}

@dataclass(frozen=True)
class Launch:
    """What was requested on the command line: which agent, in which project, with which arguments; the menu fills in the rest. A bare --worktree with no conversation to carry on makes up a name no worktree, branch, kept tip or environment holds; a worktree launch never shares an environment a live session holds, and takes name-2, name-3 and so on; the worktree a launch named follows its environment when that was renamed for a live session holding it; an environment that records a worktree works in one however it is launched, its folder made again from the kept tip when lost; the supervisor's health check takes its numbers from the Health and backups settings, or none when the journal cannot say them."""

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
        menu = Menu(self.root, self.package / "journal.sh")
        matched = self.unheld(menu, self.environment or self.worktree or self.resume_folder(menu) or self.unused_name(menu))
        if not sys.stdin.isatty():
            menu.environment_rows(matched or self.default_environment(), menu.environments())
            return Choice(matched or self.default_environment(), "", self.stashed, self.is_skipping())
        subprocess.run(["stty", "sane"], stdin=sys.stdin, check=False)
        if not self.confirmed and UpdatePrompt(Config(self.root), menu.screen, ReleaseSource(ReleaseCheckMemory(), TimeSource())).installed_newer():
            self.log("updated before the launch: starting again on the new version")
            os.execv(sys.executable, [sys.executable, *sys.argv])
        return menu.choose(self.agent, matched, self.new or self.worktree_launch, self.stashed, self.is_skipping(), self.confirmed)

    def unused_name(self, menu: Menu) -> str:
        if not self.worktree_launch or self.environment or RESUME_FLAGS & set(self.args):
            return ""
        return WorktreeNames(self.root).unused({row.name for row in menu.environments()})

    def unheld(self, menu: Menu, name: str) -> str:
        if not (self.worktree_launch and name):
            return name
        busy_names = {row.name for row in menu.environments() if row.working}
        candidate, number = name, 1
        while candidate in busy_names:
            number += 1
            candidate = f"{name}-{number}"
        return candidate

    def chosen(self, choice: Choice) -> "Launch":
        return replace(self, worktree=choice.environment) if self.worktree and not self.environment else self

    def is_resumable(self, choice: Choice, folder: Path) -> bool:
        if not choice.resume or folder == self.root or self.provider.copy_session(self.root, folder, choice.resume):
            return bool(choice.resume)
        line = f"session {choice.resume} ran in the project's main checkout and cannot be carried into {folder}: this launch starts a fresh session"
        self.log(f"resume dropped: {line}")
        print(line, file=sys.stderr)
        return False

    def is_worktree_launch(self, worktree: Worktree) -> bool:
        if self.worktree_launch:
            return True
        return worktree.name != self.default_environment() and (worktree.path.is_dir() or self.is_recorded(worktree.name))

    def is_recorded(self, name: str) -> bool:
        return any(row.name == name and row.worktree for row in Menu(self.root, self.package / "journal.sh").environments())

    def default_environment(self) -> str:
        return "main"

    def start_refusal(self, choice: Choice) -> str:
        if self.worktree == self.default_environment():
            return MAIN_WORKTREE_REFUSAL
        return next((row.refusal for row in Menu(self.root, self.package / "journal.sh").environments() if row.name == choice.environment), "")

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
                code = self.chosen(choice).supervise(choice)
            finally:
                peers.restore()
            self.log(f"ended: the supervisor's loop exited with {code}")
            return code
        except WorktreeFailure as failed:
            self.log(f"refused: {failed}")
            print(failed, file=sys.stderr)
            return 1
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
        self.stop_earlier_launch(path)
        path.touch(mode=0o600)
        path.chmod(0o600)
        path.write_text(json.dumps(launch))
        PageWait(self.runtime.parent / "port", launch["socket"], (launch["band"]["left"], launch["band"]["middle"]), "" if self.browser_off else f"?env={choice.environment}", self.log).start()
        try:
            return subprocess.run(["sh", str(self.package / "supervisor" / "launcher.sh"), sys.executable, str(path)], cwd=self.root).returncode
        finally:
            if path.is_file() and json.loads(path.read_text()).get("launch") == launch["launch"]:
                path.unlink()

    def stop_earlier_launch(self, path: Path) -> None:
        owner = int(json.loads(path.read_text()).get("owner", 0)) if path.is_file() else 0
        if not owner or owner == os.getpid() or not ProcessCheck.is_running(owner):
            return
        group = os.getpgid(owner)
        if group == os.getpgid(0):
            os.kill(owner, signal.SIGTERM)
        else:
            os.killpg(group, signal.SIGTERM)
        self.log(f"stopped: the earlier launch of this environment, process {owner} and its agent, which this session takes over")

    def health_numbers(self) -> dict:
        answer = Menu(self.root, self.package / "journal.sh").journal("supervision", "health").strip()
        return json.loads(answer) if answer.startswith("{") else {}

    def launch_file(self, choice: Choice, status: StatusLine) -> dict:
        launch = uuid.uuid4().hex
        environ = self.environ(choice, launch)
        worktree = WorkspaceWorktree.chosen(self.root, self.worktree or choice.environment)
        folder = worktree.created() if self.is_worktree_launch(worktree) else self.root
        if folder != self.root:
            Menu(self.root, self.package / "journal.sh").journal("environment", "branch", choice.environment, worktree.branch)
            self.provider.worktree_hooks(self.root, folder, HOOK_SCRIPT, self.provider.hook_command(self.root))
        # the launch folder is trusted before the program starts, the project's own folder too, so on a fresh volume no
        # trust question waits for an Enter nobody presses
        self.provider.folder_trusted(self.root, folder)
        journal = {"name": "journal", "command": self.journal_command(), "folder": str(self.root), "env": environ, "log": str(self.runtime / "server.log"), "health": {**JOURNAL_HEALTH, **self.health_numbers(), "port_file": str(self.runtime.parent / "port")}, "boot": self.boot_watch()}
        return {
            "launch": launch,
            "front": {"command": self.agent_command(choice, status), "resume": list(self.provider.resume(choice.resume)) if self.is_resumable(choice, folder) else [], "folder": str(folder), "env": environ},
            "services": [] if self.journal_off else [journal],
            "socket": str(self.socket(choice.environment)),
            "owner": os.getpid(),
            "announce": str(self.runtime / "inboxes" / choice.environment),
            "screen": str(self.runtime / "screens" / f"{choice.environment}.out"),
            "band": {"left": "agent-journal", "middle": f"{self.root.name} · {choice.environment}", "right": "journal starting…"},
        }

    def boot_watch(self) -> dict:
        backup_path = self.runtime.parent / "last_good"
        return {"notice": str(self.runtime / BOOT_NOTICE), "keep_source": str(self.package), "keep_copy": str(backup_path), "fallback_command": [sys.executable, str(backup_path / "journal.py"), "serve"], "seconds_file": str(self.runtime / BOOT_SECONDS)}

    def socket(self, environment: str) -> Path:
        key = hashlib.sha1(str(self.root.resolve()).encode()).hexdigest()[:12]
        slug = re.sub(r"[^A-Za-z0-9_-]", "-", environment)[:16]
        name_key = hashlib.sha1(environment.encode()).hexdigest()[:7]
        return Path("/tmp") / f"journal-{os.getuid()}" / f"{key}-{slug}-{name_key}.sock"

    @property
    def runtime(self) -> Path:
        return self.root / ".journal" / "runtime"
