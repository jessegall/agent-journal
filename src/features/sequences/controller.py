import json
import re
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from controllers.types import Agents
from features.sequences.resource import Sequence
from features.triggers.resource import START
from resources.base import AGENT, SECTION, SYSTEM

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
        trigger = types_module.CONTROLLERS[TRIGGER](self.record, actor=SYSTEM).load(int(n)) if kind == TRIGGER and n.isdigit() else None
        if trigger and trigger.does != START:
            self._refuse(f"trigger {trigger.n} does {trigger.does}, so it starts nothing: journal trigger update {trigger.n} --set does=start first")
        if trigger and not trigger.completed:
            return
        self._refuse(f"starts_on {start!r} is no moment: use <type>.created or <type>.completed for a row type "
                     f"({', '.join(sorted(t for t in resources_module.TYPES if t != 'sequence'))}), or trigger:<n> to start when trigger n fires")

    def _moments(self) -> set[str]:
        return {f"{kind}.{moment}" for kind, resource in resources_module.TYPES.items() if kind != "sequence" for moment in resource.moments}

    def run(self, n: int, about: str = ""):
        r = self.load(int(n))
        if not self._steps(r):
            self._refuse(f"sequence {r.n} has no steps: journal sequence section {r.n} \"<step>\" \"<what to do>\"")
        self._mark(r, "Sequence restarted" if self._running(r, about) else "Sequence started", 1, about=about)
        run = {"step": 1, "at": time.time(), "titles": self._titles(r), **({"agent": self.agent} if self.agent else {})}
        return self.update(r.n, runs={**r.runs, self._key(about): run})

    def _running(self, r, about: str) -> bool:
        return self._key(about) in r.runs

    def next(self, n: int, about: str = ""):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}: journal sequence run {r.n} starts it")
        handing = bool(r.dispatch) and self.agent == r.dispatch
        if self.actor == AGENT and not handing and r.runs[key].get("followed") != r.runs[key]["step"]:
            self._refuse(f"step {r.runs[key]['step']} of sequence {r.n} was never taken up: journal sequence follow {r.n}"
                         f"{' --about ' + about if about else ''}, do what it says, then move on")
        titles = self._titles(r)
        run = {**r.runs[key], "step": r.runs[key]["step"] + 1, "stepped": time.time(), "titles": titles}
        runs = {k: v for k, v in r.runs.items() if k != key}
        going = run["step"] <= len(titles)
        self._mark(r, "Sequence moved on" if going else "Sequence finished", run["step"] if going else 0)
        moved = self.update(r.n, runs={**runs, key: run} if going else runs)
        if not going:
            self._resume()
        return self.follow(r.n, about=about) if going and handing else moved

    def follow(self, n: int, about: str = ""):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}: journal sequence run {r.n} starts it")
        taken = {"followed": r.runs[key]["step"], **({"agent": self.agent} if self.agent else {})}
        r = self.update(r.n, runs={**r.runs, key: {**r.runs[key], **taken}})
        steps, step = self._steps(r), r.runs[key]["step"]
        return f"Step {step} of {len(steps)} of sequence {r.n}, {steps[step - 1][SECTION.title]}: {steps[step - 1][SECTION.body]}"

    def _jump(self, n: int, about: str, step: int):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}")
        self._mark(r, "Sequence moved on", step)
        run = {k: v for k, v in r.runs[key].items() if k != "followed"}
        return self.update(r.n, runs={**r.runs, key: {**run, "step": step, "stepped": time.time(), "titles": self._titles(r)}})

    def _finish(self, n: int, about: str):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            return r
        self._mark(r, "Sequence finished", 0)
        finished = self.update(r.n, runs={k: v for k, v in r.runs.items() if k != key})
        self._resume()
        return finished

    def _resume(self) -> None:
        found = self._in_hand()
        if not found:
            return
        sequence, key, run = found
        handed = {k: v for k, v in run.items() if k != "followed"}
        self.update(sequence.n, runs={**sequence.runs, key: {**handed, "stepped": time.time()}})

    def _running_here(self) -> list:
        return [self.load(row["n"]) for row in self.summaries() if not row["completed"] and not row["deleted"]
                and any(key.split("|", 1)[0] == self.record.env for key in row.get("runs") or {})]

    def _in_hand(self):
        live = self._running_here()
        mine = [(sequence.lasting, run["at"], sequence, key, run) for sequence in live if not sequence.dispatch
                for key, run in sequence.runs.items() if key.split("|", 1)[0] == self.record.env]
        return min(mine, key=lambda found: (found[0], -found[1]))[2:] if mine else None

    def _left(self, r, run: dict) -> list[str]:
        return (run.get("titles") or self._titles(r))[run["step"] - 1:]

    def abandon(self, n: int, about: str = "", why: str = "", sure: bool = False):
        r = self.load(int(n))
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}")
        if not why.strip():
            self._refuse("say why it is abandoned: --why \"<why>\"")
        flag = f"{' --about ' + about if about else ''}"
        if self.actor == AGENT and r.runs[key].get("followed") != r.runs[key]["step"]:
            self._refuse(f"step {r.runs[key]['step']} of sequence {r.n} was never taken up, so you cannot know it no longer applies: "
                         f"journal sequence follow {r.n}{flag} and read it first")
        if self.actor == AGENT and not sure:
            self._refuse(f"abandoning skips {'; '.join(self._left(r, r.runs[key]))}. If none of these still applies, "
                         f"journal sequence abandon {r.n}{flag} --why \"<why>\" --sure")
        runs = {k: v for k, v in r.runs.items() if k != key}
        left = {"about": key, "step": r.runs[key]["step"], "why": why.strip(), "at": time.time()}
        self._mark(r, "Sequence abandoned", 0, why.strip())
        abandoned = self.update(r.n, runs=runs, abandoned=[*(r.data.get("abandoned") or []), left])
        self._resume()
        return abandoned

    @internal
    def give_up(self, about: str, why: str) -> None:
        for row in self.summaries():
            if not row["completed"] and not row["deleted"] and self._key(about) in (row.get("runs") or {}):
                self.abandon(row["n"], about=about, why=why)

    def _mark(self, r, label: str, step: int, why: str = "", about: str = "") -> None:
        if r.dispatch:
            return
        agents = Agents(self.record, actor=SYSTEM)
        row = agents.primary()
        if not row:
            return
        parts = [r.title, f"step {step}, {self._steps(r)[step - 1][SECTION.title]}" if step else "", f"about {about.replace(':', ' ')}" if about.strip() else "", why]
        depth = max(0, self._open() - (label != "Sequence started"))
        agents.card(row.n, label=label, icon=self.resource.icon, color=VIOLET, detail=" · ".join(p for p in parts if p), ref=r.ref, depth=depth)

    def _open(self) -> int:
        return sum(1 for row in self.summaries() if not row["completed"] and not row["deleted"]
                   for key in row.get("runs") or {} if key.split("|", 1)[0] == self.record.env)

    def _key(self, about: str) -> str:
        return f"{self.record.env}|{about.strip() or BY_HAND}"


resources_module.register(Sequence)
types_module.register(Sequences)
