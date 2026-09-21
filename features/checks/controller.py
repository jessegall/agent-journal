import threading
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from engine.proc import ran
from features.checks.resource import Check
from resources.base import Refused

TIMEOUT = 600
SAID_LINES = 40


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
        done = ran(["/bin/sh", "-c", check.command], self.record.root.parent, timeout=TIMEOUT)
        said = ((done.stdout + done.stderr) if done else "the command did not finish").strip().splitlines()
        check.last = {"ok": bool(done) and done.returncode == 0, "code": done.returncode if done else -1,
                      "at": began, "took": round(time.time() - began, 2), "said": "\n".join(said[-SAID_LINES:])}
        return self.save(check, "updated", ran=True)

    def _due(self, now: float) -> list:
        return [check for check in self._standing()
                if check.command and check.every and now - float((check.last or {}).get("at") or 0) >= float(check.every) * 60]


resources_module.register(Check)
types_module.register(Checks)
