import re
import threading
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from engine.proc import streamed
from features.checks.resource import Check
from resources.base import Refused

TIMEOUT = 600
SAID_LINES = 40
KEPT_RUNS = 20
TOLD_EVERY = 1.0
PERCENT = re.compile(r"(\d{1,3})%")


def tail(output: str) -> str:
    return "\n".join(output.strip().splitlines()[-SAID_LINES:])


def percent(output: str) -> int | None:
    found = PERCENT.findall(output[-2000:])
    return min(100, int(found[-1])) if found else None


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
            threading.Thread(target=self._ran, args=(n,), daemon=True).start()
            return f"check {n} is running; its result lands on the row, and a failure is told to you"
        return self._ran(n)

    def sweep(self, wait: bool = False):
        return [self.run(check.n, wait=wait) for check in self._standing() if check.command]

    def _ran(self, n: int):
        check = self.load(n)
        began = time.time()
        self.stamp(n, running={"at": began, "said": "", "percent": None})
        told = [began]

        def heard(output: str) -> None:
            if time.time() - told[0] >= TOLD_EVERY:
                told[0] = time.time()
                self.stamp(n, running={"at": began, "said": tail(output), "percent": percent(output)})

        code, output = streamed(["/bin/sh", "-c", check.command], self.record.root.parent, TIMEOUT, heard)
        check = self.load(n)
        check.last = {"ok": code == 0, "code": -1 if code is None else code, "at": began, "took": round(time.time() - began, 2),
                      "said": tail(output) or ("" if code is not None else "the command did not finish")}
        check.runs = [{k: check.last[k] for k in ("ok", "code", "at", "took")}, *(check.runs or [])][:KEPT_RUNS]
        check.running = {}
        return self.save(check, "updated", ran=True)

    def _due(self, now: float) -> list:
        return [check for check in self._standing()
                if check.command and check.every and now - float((check.last or {}).get("at") or 0) >= float(check.every) * 60]


resources_module.register(Check)
types_module.register(Checks)
