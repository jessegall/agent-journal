import os
import re
import threading
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from engine.proc import streamed
from engine.watch import threw
from engine import runtime
from engine.stored import read_json
from features.checks.resource import Check, CheckReport, CheckRun
from resources.base import Refused

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


def progress(output: str, last_steps: int = 0) -> dict:
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
