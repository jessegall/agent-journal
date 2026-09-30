import os
import re
import threading
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from engine.proc import streamed
from controllers.faults import threw
from engine import runtime
from engine.stored import read_json
from features.checks.resource import Check, CheckReport, CheckRun
from controllers.types import Nudges
from engine.worktree import git
from features.checks.touched import changed, covering
from resources.base import SYSTEM, Refused, titled
from typing import TypedDict

TIMEOUT = 600
SAID_LINES = 40
KEPT_RUNS = 20
STAMP_EVERY = 1.0
REPORTS = "check-reports"
REPORT = "JOURNAL_REPORT"
PERCENT = re.compile(r"(\d{1,3})%")
COUNTED = re.compile(r"\b(\d+)\s*/\s*(\d+)\b")
ITEMS = re.compile(r"\[(\d+) items?\]|collected (\d+) items?")
STEPS = re.compile(r"^[.FEsxX]+(?=\s*(?:\[\s*\d+%\])?\s*$)", re.M)


def tail(output: str) -> str:
    return "\n".join(output.strip().splitlines()[-SAID_LINES:])


def steps(output: str) -> int:
    return sum(len(found) for found in STEPS.findall(output))


class Progress(TypedDict, total=False):
    done: int
    total: int
    percent: float | None


def progress(output: str, last_steps: int = 0) -> Progress:
    counted = COUNTED.findall(output[-2000:])
    if counted and 0 < int(counted[-1][1]) and int(counted[-1][0]) <= int(counted[-1][1]):
        done, total = int(counted[-1][0]), int(counted[-1][1])
        return {"done": done, "total": total, "percent": round(done / total * 100, 1)}
    listed = ITEMS.findall(output)
    total = int(next(filter(None, listed[-1]))) if listed else last_steps
    done = steps(output)
    if done and total:
        return {"done": min(done, total), "total": total, "percent": round(min(done, total) / total * 100, 1)}
    printed = PERCENT.findall(output[-2000:])
    return {"percent": min(100, int(printed[-1]))} if printed else {"percent": None}


class Checks(Controller):
    resource = Check

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        made = super().create(title, abstract, brief, **data)
        return self.update(made.n, buttons=[{"label": "Run", "type": self.type, "action": "run", "n": made.n, "again": True}])

    def run(self, n: int, wait: bool = False):
        check = self.load(n)
        if not check.command:
            raise Refused(f"check {n} has no command: journal check set {n} command \"<what to run>\"")
        if not wait:
            threading.Thread(target=self._ran_in_background, args=(n,), daemon=True).start()
            return f"check {n} is running; its result lands on the row, and a failure is told to you"
        return self._ran(n)

    def touched(self, n: int) -> str:
        check = self.load(n)
        if not check.touched:
            raise Refused(f"check {n} names no command for touched tests: journal check set {n} touched \"<command with {{tests}}>\"")
        project = self.record.root.resolve().parent
        found = covering(project, changed(project))
        if not found.tests:
            return f"no test covers what changed ({found.uncovered or 'nothing changed'}); the full check is the gate"
        code, output = streamed(["/bin/sh", "-c", check.touched.replace("{tests}", " ".join(found.tests))], project, TIMEOUT, lambda _: None)
        uncovered = f"\nno test covers {found.uncovered}; the full check is the gate for those" if found.bare else ""
        return f"{tail(output)}{uncovered}" if code == 0 else f"failed:\n{tail(output)}"

    def gate(self, n: int, message: str, paths: str):
        if not self.load(n).command:
            raise Refused(f"check {n} has no command: journal check set {n} command \"<what to run>\"")
        named = [path.strip() for path in paths.split(",") if path.strip()]
        if not named:
            raise Refused("name the paths the commit takes: --paths <path>,<path>")
        threading.Thread(target=self._gated, args=(n, message, named), daemon=True).start()
        return f"check {n} is running; on a pass it commits {len(named)} paths, and you are told either way"

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
        project = self.record.root.resolve().parent
        added = git(project, "add", "--", *paths)
        made = git(project, "commit", "-q", "-m", message) if not added.returncode else added
        if made.returncode:
            return f"check {check.n} passed but the commit failed\n{(made.stderr or made.stdout).strip()}"
        head = git(project, "log", "--oneline", "-1").stdout.strip()
        if not check.then:
            return f"check {check.n} passed and {head} is committed"
        code, output = streamed(["/bin/sh", "-c", check.then], project, TIMEOUT, lambda _: None)
        return f"check {check.n} passed and {head} is committed; then {'ran' if code == 0 else 'failed'}\n{tail(output)}"

    def sweep(self, wait: bool = False):
        return [self.run(check.n, wait=wait) for check in self._standing() if check.command]

    def _ran_in_background(self, n: int) -> None:
        try:
            self._ran(n)
        except Exception:
            threw(self.record.root, self.record.env, f"running check {n}")

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
        code, output = streamed(["/bin/sh", "-c", check.command], self.record.root.parent, TIMEOUT, on_output, env={**os.environ, REPORT: str(report)})
        check = self.load(n)
        kept = tail(output)
        written = read_json(report, None)
        run = CheckRun(ok=code == 0, code=-1 if code is None else code, at=began, took=round(time.time() - began, 2), steps=steps(output),
                       output=kept if kept or code is not None else "the command did not finish",
                       report=CheckReport.from_json(written) if isinstance(written, dict) else None)
        check.last = run.to_json()
        check.runs = [run.summary, *check.runs][:KEPT_RUNS]
        check.running = {}
        return self.save(check, "updated", ran=True)

    def _due(self, now: float) -> list:
        return [check for check in self._standing()
                if check.command and check.every and now - (check.last_run.at if check.last_run.at else check.created) >= float(check.every) * 60]


resources_module.register(Check)
types_module.register(Checks)
