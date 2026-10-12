import json
import re
import time

import resources.types as resources_module
from engine.given import given
from controllers.agents import Agents
from controllers.base import CONTROLLERS, Controller
from controllers.triggers.controller import Triggers
from resources.sequences import BY_HAND, RunKey, SEQUENCES, SEQUENCE_STEPS, Sequence
from resources.triggers import START
from resources.base import AGENT, SECTION, SYSTEM, Refused
from declaring.extension import Extension
from controllers.marks import action

VIOLET = "#a78bfa"
TRIGGER = "trigger"
INCLUDED = re.compile(r"^sequence:(\d+)(?: steps (\d+)(?:-(\d+))?)?$")


SHIPPED = Extension()
"""The titles of the sequences a feature ships, by the job a controller finds them for; the feature registers each one, so a controller never imports a feature's declarations."""


def shipped_titles(record, job: str) -> list[str]:
    return SHIPPED.each(record, job)


def shipped_title(record, job: str) -> str:
    found = shipped_titles(record, job)
    if not found:
        raise Refused(f"no sequence is shipped for {job}: the feature that ships it is off")
    return found[0]


class Sequences(Controller):
    resource = Sequence

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", starts_on: str = "", **data):
        self._check_start(starts_on)
        return super().create(title, abstract, brief, starts_on=starts_on, **data)

    @action
    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None,
               starts_on: str | None = None, **data):
        if starts_on is None:
            return super().update(n, title, abstract, brief, outcome, **data)
        self._check_start(starts_on)
        return super().update(n, title, abstract, brief, outcome, starts_on=starts_on, **data)

    def update_run(self, r, key: str, run: dict):
        return self.update(r.n, runs={**r.runs, key: run})

    @action
    def steps(self, n: int, steps: str):
        try:
            parsed = json.loads(steps) if isinstance(steps, str) else steps
        except ValueError:
            parsed = None
        if not isinstance(parsed, list) or not all(isinstance(step, dict) and str(step.get("title", "")).strip() for step in parsed):
            self._refuse('steps is a JSON list of {"title": "<step>", "body": "<what to do>"}, every step with a title')
        titles = [step["title"].strip() for step in parsed]
        if len(set(titles)) != len(titles):
            self._refuse("two steps share a title: give each step its own")
        r = self.load(n)
        r.sections = [{SECTION.title: title, SECTION.body: str(step.get("body", ""))} for title, step in zip(titles, parsed)]
        return self.save(r, "updated")

    @action
    def include(self, n: int, other: int, steps: str = ""):
        r, included = self.load(n), self.load(other)
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
                found |= self._reached(self.load(match[1]), (*seen, int(match[1])))
        return found

    def steps_of(self, r, seen: tuple = ()) -> list[dict]:
        steps = []
        for part in r.sections:
            match = INCLUDED.match(part[SECTION.body].strip())
            if not match or int(match[1]) in (*seen, r.n):
                steps.append(part)
                continue
            inner = self.steps_of(self.load(match[1]), (*seen, r.n))
            first, last = int(match[2] or 1), int(match[3] or match[2] or len(inner))
            steps += inner[first - 1:last]
        return steps

    def _titles(self, r) -> list[str]:
        return [part[SECTION.title] for part in self.steps_of(r)]

    def _check_start(self, starts_on: str) -> None:
        start = starts_on.strip()
        if not start or start in self._moments():
            return
        kind, _, n = start.partition(":")
        trigger = Triggers(self.record, actor=SYSTEM).load(n) if kind == TRIGGER and n.isdigit() else None
        if trigger and trigger.does != START:
            self._refuse(f"trigger {trigger.n} does {trigger.does}, so it starts nothing: journal trigger update {trigger.n} --set does=start first")
        if trigger and not trigger.completed:
            return
        self._refuse(f"starts_on {start!r} is no moment: use <type>.created or <type>.completed for a row type "
                     f"({', '.join(sorted(t for t in resources_module.TYPES if t != 'sequence'))}), or trigger:<n> to start when trigger n fires")

    def _moments(self) -> set[str]:
        return {f"{kind}.{moment}" for kind, resource in resources_module.TYPES.items() if kind != "sequence" for moment in resource.moments}

    @action
    def run(self, n: int, about: str | None = None):
        r = self.load(n)
        if not self.steps_of(r):
            self._refuse(f"sequence {r.n} has no steps: journal sequence section {r.n} \"<step>\" \"<what to do>\"")
        self._mark(r, "Sequence restarted" if self._running(r, about) else "Sequence started", 1, about=about)
        run = {"step": 1, "at": time.time(), "titles": self._titles(r), **given(agent=self.agent)}
        return self.update_run(r, self._key(about), run)

    def _running(self, r, about: str) -> bool:
        return self._key(about) in r.runs

    def _run_key(self, r, about: str | None, then: str = "") -> str:
        key = self._key(about)
        if key not in r.runs:
            self._refuse(f"sequence {r.n} is not running{' about ' + about if about else ''}{then}")
        return key

    @action
    def next(self, n: int, about: str | None = None, through: int | None = None):
        r = self.load(n)
        key = self._run_key(r, about, f": journal sequence run {r.n} starts it")
        handing = bool(r.dispatch) and self.agent == r.dispatch
        first = self.in_hand() if self.actor == AGENT and not handing else None
        if first and (first[0].n, first[1]) != (r.n, key):
            self._refuse(f"sequence {first[0].n}{self._flag(first[1])} was handed to you first, so sequence {r.n}{self._flag(key)} waits at step {r.runs[key]['step']}: "
                         f"journal sequence follow {first[0].n}{self._flag(first[1])}, do what it says and move on; then sequence {r.n} is handed to you again at that step")
        if self.actor == AGENT and not handing and r.runs[key].get("followed") != r.runs[key]["step"]:
            self._refuse(f"step {r.runs[key]['step']} of sequence {r.n} was never taken up: journal sequence follow {r.n}"
                         f"{' --about ' + about if about else ''}, do what it says, then move on")
        titles = self._titles(r)
        done = r.runs[key]["step"] if through is None else int(through)
        if done < r.runs[key]["step"] or done > len(titles):
            self._refuse(f"--through names a step from {r.runs[key]['step']} to {len(titles)}, the steps still ahead")
        if done == len(titles):
            self._check_finishable(r, key)
        run = {**r.runs[key], "step": done + 1, "stepped": time.time(), "titles": titles}
        runs = self.without(r, key)
        going = run["step"] <= len(titles)
        self._mark(r, "Sequence moved on" if going else "Sequence finished", run["step"] if going else 0, kind=SEQUENCE_STEPS if going else SEQUENCES)
        self.update(r.n, runs={**runs, key: run} if going else runs)
        if not going:
            self._resume()
            return f"Sequence {r.n} is finished."
        if handing:
            return self.follow(r.n, about=about)
        return f"Step {run['step']} of {len(titles)} of sequence {r.n} is next, {titles[run['step'] - 1]}: take it up with journal sequence follow {r.n}{' --about ' + about if about else ''}."

    @action
    def follow(self, n: int, about: str | None = None):
        r = self.load(n)
        key = self._run_key(r, about, f": journal sequence run {r.n} starts it")
        taken = {"followed": r.runs[key]["step"], **given(agent=self.agent)}
        r = self.update_run(r, key, {**r.runs[key], **taken})
        steps, step = self.steps_of(r), r.runs[key]["step"]
        return f"Step {step} of {len(steps)} of sequence {r.n}, {steps[step - 1][SECTION.title]}: {steps[step - 1][SECTION.body]}"

    def jump(self, n: int, about: str, step: int):
        r = self.load(n)
        key = self._run_key(r, about)
        self._mark(r, "Sequence moved on", step, kind=SEQUENCE_STEPS)
        run = {k: v for k, v in r.runs[key].items() if k != "followed"}
        return self.update_run(r, key, {**run, "step": step, "stepped": time.time(), "titles": self._titles(r)})

    def finish(self, n: int, about: str):
        r = self.load(n)
        key = self._key(about)
        if key not in r.runs:
            return r
        self._mark(r, "Sequence finished", 0)
        finished = self.update(r.n, runs=self.without(r, key))
        self._resume()
        return finished

    def _resume(self) -> None:
        found = self.in_hand()
        if not found:
            return
        sequence, key, run = found
        if sequence.lasting and run.get("followed") == run["step"]:
            return
        handed = {k: v for k, v in run.items() if k != "followed"}
        self.update_run(sequence, key, {**handed, "stepped": time.time()})

    def open_rows(self) -> list[dict]:
        return self.rows.standing_summaries()

    def _here(self, keys) -> list[str]:
        return [key for key in keys or {} if RunKey.of(key).here(self.record.env)]

    def _running_here(self) -> list:
        return [self.peek(row["n"]) for row in self.open_rows() if self._here(row.get("runs"))]

    def in_hand(self):
        mine = [(sequence.lasting, sequence.started(key), sequence, key, sequence.runs[key]) for sequence in self._running_here()
                if not sequence.dispatch for key in self._here(sequence.runs)]
        return min(mine, key=lambda found: (found[0], -found[1]))[2:] if mine else None

    def without(self, r, key: str) -> dict:
        return {k: v for k, v in r.runs.items() if k != key}

    def left(self, r, key: str) -> list[str]:
        run = r.run(key)
        return (run.titles or self._titles(r))[run.step - 1:]

    @action
    def abandon(self, n: int, about: str | None = None, why: str = "", sure: bool = False):
        r = self.load(n)
        key = self._run_key(r, about)
        if not why.strip():
            self._refuse("say why it is abandoned: --why \"<why>\"")
        flag = f"{' --about ' + about if about else ''}"
        if self.actor == AGENT and r.runs[key].get("followed") != r.runs[key]["step"]:
            self._refuse(f"step {r.runs[key]['step']} of sequence {r.n} was never taken up, so you cannot know it no longer applies: "
                         f"journal sequence follow {r.n}{flag} and read it first")
        if self.actor == AGENT and not sure:
            removal = f" and removes {RunKey.of(key).about.replace(':', ' ')}" if r.removes_on_abandon and RunKey.of(key).about != BY_HAND else ""
            self._refuse(f"abandoning skips {'; '.join(self.left(r, key))}{removal}. If none of these still applies, "
                         f"journal sequence abandon {r.n}{flag} --why \"<why>\" --sure")
        self._remove_row(r, key, why.strip())
        runs = self.without(r, key)
        left = {"about": key, "step": r.runs[key]["step"], "why": why.strip(), "at": time.time()}
        self._mark(r, "Sequence abandoned", 0, why.strip())
        abandoned = self.update(r.n, runs=runs, abandoned=[*(r.data.get("abandoned") or []), left])
        self._resume()
        return abandoned

    def _about_row(self, key: str):
        kind, _, n = RunKey.of(key).about.partition(":")
        if kind not in CONTROLLERS or not n.isdigit():
            return None
        about = CONTROLLERS[kind](self.record, actor=SYSTEM)
        if not about.rows.exists(int(n)):
            return None
        row = about.peek(int(n))
        return None if row.deleted else row

    def _check_finishable(self, r, key: str) -> None:
        row = self._about_row(key)
        for name, wanted in r.finishes_when.items():
            allowed = wanted if isinstance(wanted, list) else [wanted]
            found = row.data.get(name, getattr(row, name, None)) if row else None
            found = bool(found) if isinstance(wanted, bool) else found
            if row and found not in allowed:
                self._refuse(f"sequence {r.n} cannot finish until {row.ref} has {name} {' or '.join(map(str, allowed))}, and it has {found}: "
                             f"do what the steps say to get it there, then journal sequence next {r.n}{self._flag(key)}")

    def _remove_row(self, r, key: str, why: str) -> None:
        row = self._about_row(key) if r.removes_on_abandon else None
        if row:
            CONTROLLERS[row.type](self.record, actor=SYSTEM).delete(row.n, why=f"sequence {r.n} was abandoned: {why}")

    def give_up(self, about: str, why: str) -> None:
        for row in self.open_rows():
            if self._key(about) in (row.get("runs") or {}):
                self.abandon(row["n"], about=about, why=why)

    def _mark(self, r, label: str, step: int, why: str = "", about: str | None = None, kind: str = SEQUENCES) -> None:
        if r.dispatch:
            return
        agents = Agents(self.record, actor=SYSTEM)
        row = agents.primary()
        if not row:
            return
        parts = [r.title, f"step {step}, {self.steps_of(r)[step - 1][SECTION.title]}" if step else "", f"about {about.replace(':', ' ')}" if about is not None and about.strip() else "", why]
        depth = max(0, self._open() - (label != "Sequence started"))
        agents.card(row.n, label=label, icon=self.resource.icon, color=VIOLET, detail=" · ".join(p for p in parts if p), ref=r.ref, depth=depth, kind=kind)

    def _open(self) -> int:
        return sum(len(self._here(row.get("runs"))) for row in self.open_rows())

    @staticmethod
    def _flag(key: str) -> str:
        run = RunKey.of(key)
        return "" if run.by_hand else f" --about {run.about}"

    def _key(self, about: str | None) -> str:
        named = about.strip() if about is not None else ""
        return RunKey(self.record.env, named or BY_HAND).text
