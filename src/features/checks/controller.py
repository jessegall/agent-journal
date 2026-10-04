import fcntl
import os
import subprocess
import threading
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import lasting
from engine.package import entry
from engine.proc import streamed
from controllers.faults import threw
from engine import runtime
from engine.stored import claim, read_json
from features.checks.output import progress, steps, tail
from features.checks.resource import TIMEOUT, Check, CheckReport, CheckRun
from controllers.types import Nudges
from engine.worktree import git
from features.checks.touched import changed, covering
from resources.base import SYSTEM, Refused, titled

KEPT_RUNS = 20
STAMP_EVERY = 1.0
REPORTS = "check-reports"
GATES = "gates.lock"
REPORT = "JOURNAL_REPORT"


class Checks(Controller):
    resource = Check

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        made = super().create(title, abstract, brief, **data)
        return self.update(made.n, buttons=[{"label": "Run", "type": self.type, "action": "run", "n": made.n, "again": True}])

    def run(self, n: int, wait: bool = False):
        self._runnable(n)
        if wait:
            return self._ran(n)
        if not self._in_background(n):
            return f"check {n} is already running; its result lands on the row"
        return f"check {n} is running; its result lands on the row, and a failure is told to you"

    def _runnable(self, n: int):
        check = self.load(n)
        if not check.command:
            raise Refused(f"check {n} has no command: journal check set {n} command \"<what to run>\"")
        return check

    @property
    def _project(self):
        return self.record.root.resolve().parent

    def _shell(self, command: str, on_output=lambda _: None, env: dict | None = None, timeout: float = TIMEOUT) -> tuple[int | None, str]:
        return streamed(["/bin/sh", "-c", command], self._project, timeout, on_output, env=env)

    @lasting
    def touched(self, n: int) -> str:
        check = self.load(n)
        if not check.touched:
            raise Refused(f"check {n} names no command for touched tests: journal check set {n} touched \"<command with {{tests}}>\"")
        found = covering(self._project, changed(self._project))
        if not found.tests:
            return f"no test covers what changed ({found.uncovered or 'nothing changed'}); the full check is the gate"
        code, output = self._shell(check.touched.replace("{tests}", " ".join(found.tests)))
        uncovered = f"\nno test covers {found.uncovered}; the full check is the gate for those" if found.bare else ""
        return f"{tail(output)}{uncovered}" if code == 0 else f"failed:\n{tail(output)}"

    @lasting
    def gate(self, n: int, message: str, paths: str = "", wait: bool = False):
        self._runnable(n)
        named = [path.strip() for path in paths.split(",") if path.strip()]
        if not named:
            raise Refused("name the paths the commit takes: --paths <path>,<path>")
        if wait:
            with open(runtime.folder(self.record.root) / GATES, "a") as held:
                fcntl.flock(held, fcntl.LOCK_EX)
                self._gated(n, message, named)
            return f"check {n} gated its commit"
        subprocess.Popen([*entry("journal"), "--root", str(self.record.root), "--env", self.record.env, "check", "gate", str(n), message,
                          "--paths", ",".join(named), "--wait"], cwd=self.record.root.parent, start_new_session=True,
                         stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return f"check {n} is running in a process of its own, after any gate before it; on a pass it commits {len(named)} paths, and you are told either way"

    def _gated(self, n: int, message: str, paths: list[str]) -> None:
        try:
            self._ran(n)
            told = self._landed(self.load(n), message, paths)
        except Exception:
            threw(self.record.root, self.record.env, f"gating on check {n}")
            return
        Nudges(self.record, actor=SYSTEM)._to_primary(titled(told.split("\n")[0]), told)

    def _landed(self, check, message: str, paths: list[str]) -> str:
        if not check.last_run.ok:
            return f"check {check.n} failed, nothing was committed\n{check.last_run.output}"
        project = self._project
        git(project, "reset", "-q")
        added = git(project, "add", "-A", "--", *paths)
        made = git(project, "commit", "-q", "-m", message) if not added.returncode else added
        if made.returncode:
            return f"check {check.n} passed but the commit failed\n{(made.stderr or made.stdout).strip()}"
        head = git(project, "log", "--oneline", "-1").stdout.strip()
        if not check.then:
            return f"check {check.n} passed and {head} is committed"
        code, output = self._shell(check.then)
        return f"check {check.n} passed and {head} is committed; then {'ran' if code == 0 else 'failed'}\n{tail(output)}"

    def sweep(self, wait: bool = False):
        return [self.run(check.n, wait=wait) for check in self._standing() if check.command]

    def _in_background(self, n: int) -> bool:
        held = claim(runtime.folder(self.record.root) / REPORTS / f"{n}.lock")
        if not held:
            return False
        threading.Thread(target=self._ran_in_background, args=(n, held), daemon=True).start()
        return True

    def _ran_in_background(self, n: int, held) -> None:
        try:
            self._ran(n)
        except Exception:
            threw(self.record.root, self.record.env, f"running check {n}")
        finally:
            held.close()

    def _ran(self, n: int):
        check = self.load(n)
        began, last_steps = time.time(), check.last_run.steps
        self.stamp(n, running={"at": began, "output": "", "percent": None})
        stamped_at = [began]

        def on_output(output: str) -> None:
            if time.time() - stamped_at[0] >= STAMP_EVERY:
                stamped_at[0] = time.time()
                self.stamp(n, running={"at": began, "output": tail(output), **progress(output, last_steps)})

        report = runtime.folder(self.record.root) / REPORTS / f"{n}.json"
        report.parent.mkdir(parents=True, exist_ok=True)
        report.unlink(missing_ok=True)
        timeout = float(check.timeout)
        code, output = self._shell(check.command, on_output, env={**os.environ, REPORT: str(report)}, timeout=timeout)
        check, took = self.load(n), time.time() - began
        kept = tail(output)
        if code is None and took >= timeout:
            kept = "\n".join(part for part in (kept, f"check {n} ran out of time: stopped after {timeout:g} seconds; "
                                                      f"journal check set {n} timeout <seconds> gives it longer") if part)
        written = read_json(report, CheckReport.from_json, None)
        run = CheckRun(ok=code == 0, code=-1 if code is None else code, at=began, took=round(took, 2), steps=steps(output),
                       output=kept if kept or code is not None else "the command did not finish",
                       report=written)
        check.last = run.to_json()
        check.runs = [run.summary, *check.runs][:KEPT_RUNS]
        check.running = {}
        return self.save(check, "updated", ran=True)

    def _due(self, now: float) -> list:
        return [check for check in self._standing()
                if check.command and check.every and now - (check.last_run.at if check.last_run.at else check.created) >= float(check.every) * 60]


resources_module.register(Check)
types_module.register(Checks)
