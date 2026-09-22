import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from features.sequences.resource import Sequence

BY_HAND = "by hand"


class Sequences(Controller):
    resource = Sequence

    def run(self, n: int, about: str = ""):
        r = self.load(int(n))
        if not r.sections:
            self._refuse(f"sequence {r.n} has no steps: journal sequence section {r.n} \"<step>\" \"<what to do>\"")
        return self.update(r.n, runs={**r.runs, self._key(about): {"step": 1, "at": time.time()}})

    def next(self, n: int, about: str = ""):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}: journal sequence run {r.n} starts it")
        run = {**r.runs[key], "step": r.runs[key]["step"] + 1}
        runs = {k: v for k, v in r.runs.items() if k != key}
        return self.update(r.n, runs={**runs, key: run} if run["step"] <= len(r.sections) else runs)

    def _in_hand(self):
        live = [self.load(row["n"]) for row in self.summaries() if not row["completed"] and not row["deleted"]]
        mine = [(run["at"], sequence, key, run) for sequence in live for key, run in sequence.runs.items()
                if key.split("|", 1)[0] == self.record.env]
        return min(mine, key=lambda found: found[0])[1:] if mine else None

    def abandon(self, n: int, about: str = "", why: str = ""):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}")
        if not why.strip():
            self._refuse("say why it is abandoned: --why \"<why>\"")
        runs = {k: v for k, v in r.runs.items() if k != key}
        left = {"about": key, "step": r.runs[key]["step"], "why": why.strip(), "at": time.time()}
        return self.update(r.n, runs=runs, abandoned=[*(r.data.get("abandoned") or []), left])

    def _key(self, about: str) -> str:
        return f"{self.record.env}|{about.strip() or BY_HAND}"


resources_module.register(Sequence)
types_module.register(Sequences)
