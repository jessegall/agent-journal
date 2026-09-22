import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import WORDS, Controller
from controllers.marks import internal
from features.sequences.resource import Sequence
from resources.base import SYSTEM

BY_HAND = "by hand"
PROGRESS = ("runs", "abandoned")


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

    def delete(self, n: int, why: str = ""):
        self._kept(n)
        return super().delete(n, why)

    def complete(self, n: int, how: str = "", **data):
        self._kept(n)
        return super().complete(n, how, **data)

    @internal
    def save(self, r, action: str, **event):
        stored = self.load(r.n) if self._exists(r.n) else None
        if stored and stored.system and self.actor != SYSTEM and self._rewritten(stored, r):
            self._refuse(f"sequence {r.n} ships with the journal and cannot be changed")
        return super().save(r, action, **event)

    def _rewritten(self, stored, r) -> bool:
        kept = lambda row: {k: v for k, v in row.data.items() if k not in PROGRESS}
        return any(getattr(stored, f) != getattr(r, f) for f in WORDS) or stored.sections != r.sections or kept(stored) != kept(r)

    def _kept(self, n: int) -> None:
        if self.load(int(n)).system:
            self._refuse(f"sequence {n} ships with the journal and cannot be removed")

    def _key(self, about: str) -> str:
        return f"{self.record.env}|{about.strip() or BY_HAND}"


resources_module.register(Sequence)
types_module.register(Sequences)
