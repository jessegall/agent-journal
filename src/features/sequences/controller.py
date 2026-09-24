import json
import re
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from controllers.types import Agents
from features.sequences.resource import Sequence
from resources.base import SECTION, SYSTEM

BY_HAND = "by hand"
VIOLET = "#a78bfa"
TRIGGER = "trigger"
INCLUDED = re.compile(r"^sequence:(\d+)(?: steps (\d+)(?:-(\d+))?)?$")


class Sequences(Controller):
    resource = Sequence

    def create(self, title: str, abstract: str = "", brief: str = "", starts_on: str = "", **data):
        self._check_start(starts_on)
        return super().create(title, abstract, brief, starts_on=starts_on, **data)

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None,
               starts_on: str | None = None, **data):
        if starts_on is None:
            return super().update(n, title, abstract, brief, outcome, **data)
        self._check_start(starts_on)
        return super().update(n, title, abstract, brief, outcome, starts_on=starts_on, **data)

    def steps(self, n: int, steps: str):
        try:
            given = json.loads(steps) if isinstance(steps, str) else steps
        except ValueError:
            given = None
        if not isinstance(given, list) or not all(isinstance(step, dict) and str(step.get("title", "")).strip() for step in given):
            self._refuse('steps is a JSON list of {"title": "<step>", "body": "<what to do>"}, every step with a title')
        titles = [step["title"].strip() for step in given]
        if len(set(titles)) != len(titles):
            self._refuse("two steps share a title: give each step its own")
        r = self.load(int(n))
        r.sections = [{SECTION.title: title, SECTION.body: str(step.get("body", ""))} for title, step in zip(titles, given)]
        return self.save(r, "updated")

    def include(self, n: int, other: int, steps: str = ""):
        r, included = self.load(int(n)), self.load(int(other))
        span = steps.strip()
        if span and not re.fullmatch(r"\d+(?:-\d+)?", span):
            self._refuse('steps is one step or a range, like 2 or 2-4')
        body = f"sequence:{included.n}{f' steps {span}' if span else ''}"
        if r.n == included.n or r.n in self._reached(included, (included.n,)):
            self._refuse(f"sequence {included.n} already includes sequence {r.n}: including it back would never end")
        title = f"{included.title}{f', steps {span}' if span else ''}"
        return self.section(r.n, title, body)

    def _reached(self, r, seen: tuple) -> set[int]:
        found = set()
        for part in r.sections:
            match = INCLUDED.match(part[SECTION.body].strip())
            if not match:
                continue
            found.add(int(match[1]))
            if int(match[1]) not in seen:
                found |= self._reached(self.load(int(match[1])), (*seen, int(match[1])))
        return found

    def _steps(self, r, seen: tuple = ()) -> list[dict]:
        steps = []
        for part in r.sections:
            match = INCLUDED.match(part[SECTION.body].strip())
            if not match or int(match[1]) in (*seen, r.n):
                steps.append(part)
                continue
            inner = self._steps(self.load(int(match[1])), (*seen, r.n))
            first, last = int(match[2] or 1), int(match[3] or match[2] or len(inner))
            steps += inner[first - 1:last]
        return steps

    def _titles(self, r) -> list[str]:
        return [part[SECTION.title] for part in self._steps(r)]

    def _check_start(self, starts_on: str) -> None:
        start = starts_on.strip()
        if not start or start in self._moments():
            return
        kind, _, n = start.partition(":")
        if kind == TRIGGER and n.isdigit() and not types_module.CONTROLLERS[TRIGGER](self.record, actor=SYSTEM).load(int(n)).completed:
            return
        self._refuse(f"starts_on {start!r} is no moment: use <type>.created or <type>.completed for a row type "
                     f"({', '.join(sorted(t for t in resources_module.TYPES if t != 'sequence'))}), or trigger:<n> to start when trigger n fires")

    def _moments(self) -> set[str]:
        return {f"{kind}.{moment}" for kind, resource in resources_module.TYPES.items() if kind != "sequence" for moment in resource.moments}

    def run(self, n: int, about: str = ""):
        r = self.load(int(n))
        if not self._steps(r):
            self._refuse(f"sequence {r.n} has no steps: journal sequence section {r.n} \"<step>\" \"<what to do>\"")
        self._mark(r, "Sequence started", about, 1)
        return self.update(r.n, runs={**r.runs, self._key(about): {"step": 1, "at": time.time(), "titles": self._titles(r)}})

    def next(self, n: int, about: str = ""):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}: journal sequence run {r.n} starts it")
        titles = self._titles(r)
        run = {**r.runs[key], "step": r.runs[key]["step"] + 1, "stepped": time.time(), "titles": titles}
        runs = {k: v for k, v in r.runs.items() if k != key}
        going = run["step"] <= len(titles)
        self._mark(r, "Sequence moved on" if going else "Sequence finished", about, run["step"] if going else 0)
        return self.update(r.n, runs={**runs, key: run} if going else runs)

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
        self._mark(r, "Sequence abandoned", about, 0, why.strip())
        return self.update(r.n, runs=runs, abandoned=[*(r.data.get("abandoned") or []), left])

    @internal
    def give_up(self, about: str, why: str) -> None:
        for sequence in self.all(last=0):
            if self._key(about) in sequence.runs:
                self.abandon(sequence.n, about=about, why=why)

    def _mark(self, r, label: str, about: str, step: int, why: str = "") -> None:
        agents = Agents(self.record, actor=SYSTEM)
        row = agents.primary()
        if not row:
            return
        if r.system:
            agents.card(row.n, label=f"{label} sequence {r.n}", icon=self.resource.icon, color=VIOLET)
            return
        parts = [f"sequence {r.n} {r.title}", f"step {step}, {self._steps(r)[step - 1][SECTION.title]}" if step else "", f"about {about.replace(':', ' ')}" if about.strip() else "", why]
        agents.card(row.n, label=label, icon=self.resource.icon, color=VIOLET, detail=" · ".join(p for p in parts if p))

    def _key(self, about: str) -> str:
        return f"{self.record.env}|{about.strip() or BY_HAND}"


resources_module.register(Sequence)
types_module.register(Sequences)
