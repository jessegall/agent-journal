import fcntl
import os
import subprocess
import threading
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import action
from engine.package import entry
from engine.proc import streamed
from controllers.faults import threw
from engine import runtime
from engine.load import scaled
from engine.locks import claim
from engine.stored import read_json
from features.checks.output import progress, steps, tail
from features.checks.resource import TIMEOUT, Check, CheckReport, CheckRun
from controllers.types import Environments, Nudges
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

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        made = super().create(title, abstract, brief, **data)
        return self.update(made.n, buttons=[{"label": "Run", "type": self.type, "action": "run", "n": made.n, "again": True}])

    @action
    def run(self, n: int, wait: bool = False):
        if self._with_the_agent(self.load(n)):
            return self._handed(n)
        self._require_command(n)
        if wait:
            return self._ran(n)
        if not self.in_background(n):
            return f"check {n} is already running; its result lands on the row"
        return f"check {n} is running; its result lands on the row, and a failure is told to you"

    def _require_command(self, n: int) -> None:
        if not self.load(n).command:
            raise Refused(f"check {n} has no command: journal check set {n} command \"<what to run>\", or journal check set {n} instruction \"<what the agent checks>\"")

    def _with_the_agent(self, check) -> bool:
        """Whether the agent answers it: it carries an instruction and no command, so there is nothing to run as a process."""
        return bool(check.instruction) and not check.command

    def _handed(self, n: int) -> str:
        """Hands the check's instruction to the agent as a turn; it answers with journal check pass or journal check fail."""
        check = self.load(n)
        now = time.time()
        self.stamp(n, asked_at=now, running={"at": now, "output": "waiting for the agent to answer", "percent": None})
        Nudges(self.record, actor=SYSTEM).to_primary(
            titled(f"check {n}: {check.title}"),
            f"Check {n}, {check.title}: {check.instruction}\nAnswer it with journal check pass {n} (--note \"<what you saw>\") or journal check fail {n} \"<why>\".")
        return f"check {n} is with the agent; it answers with journal check pass {n} or journal check fail {n}"

    @action
    def passes(self, n: int, note: str = ""):
        return self._answered(n, True, note or "the agent says it passes")

    @action
    def fails(self, n: int, why: str):
        return self._answered(n, False, why)

    def _answered(self, n: int, ok: bool, words: str):
        check = self.load(n)
        if not check.instruction:
            raise Refused(f"check {n} carries no instruction, so there is nothing for the agent to answer: a command says pass or fail by itself")
        began = check.asked_at or time.time()
        run = CheckRun(ok=ok, code=0 if ok else 1, at=began, took=round(time.time() - began, 2), output=words)
        check.last = run.to_json()
        check.runs = [run.summary, *check.runs][:KEPT_RUNS]
        check.running = {}
        check.asked_at = 0.0
        return self.save(check, "updated", ran=True)

    @property
    def _project(self):
        return self.record.root.resolve().parent

    def _shell(self, command: str, on_output=lambda _: None, env: dict | None = None, timeout: float = TIMEOUT) -> tuple[int | None, str]:
        return streamed(["/bin/sh", "-c", command], self._project, timeout, on_output, env=env)

    @action(network=True)
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

    @action(network=True)
    def gate(self, n: int, message: str, paths: str = "", wait: bool = False):
        self._require_command(n)
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
        Nudges(self.record, actor=SYSTEM).to_primary(titled(told.split("\n")[0]), told)

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

    @action
    def sweep(self, wait: bool = False):
        return [self.run(check.n, wait=wait) for check in self.rows.standing() if check.command or check.instruction]

    def begin(self, n: int) -> bool:
        """Starts a due check: a command in the background, an instruction as a turn for the agent; False when it is already under way."""
        if self._with_the_agent(self.load(n)):
            return self._in_main() and bool(self._handed(n))
        return self.in_background(n)

    def _in_main(self) -> bool:
        """Whether this is the main environment, the one whose agent is asked: every environment's engine sees a due check, and only the main one's agent is handed it."""
        place = Environments(self.record, actor=SYSTEM).rows.by_title(self.record.env)
        return place is None or place.is_main()

    def in_background(self, n: int) -> bool:
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
        timeout = scaled(float(check.timeout))
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

    def due(self, now: float) -> list:
        return [check for check in self.rows.standing()
                if (check.command or check.instruction) and check.every and now - (max(check.last_run.at, check.asked_at) or check.created) >= float(check.every) * 60]


resources_module.register(Check)
types_module.register(Checks)
