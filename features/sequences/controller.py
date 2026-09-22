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
        return self.update(r.n, runs={**r.runs, self._key(about): 1})

    def next(self, n: int, about: str = ""):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}: journal sequence run {r.n} starts it")
        step = r.runs[key] + 1
        runs = {k: v for k, v in r.runs.items() if k != key}
        return self.update(r.n, runs={**runs, key: step} if step <= len(r.sections) else runs)

    def delete(self, n: int, why: str = ""):
        self._kept(n)
        return super().delete(n, why)

    def complete(self, n: int, how: str = "", **data):
        self._kept(n)
        return super().complete(n, how, **data)

    def _kept(self, n: int) -> None:
        if self.load(int(n)).system:
            self._refuse(f"sequence {n} ships with the journal and cannot be removed")

    def _key(self, about: str) -> str:
        return f"{self.record.env}|{about.strip() or BY_HAND}"


resources_module.register(Sequence)
types_module.register(Sequences)
