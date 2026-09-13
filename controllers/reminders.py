from __future__ import annotations

from pathlib import Path

import fmt
import reminders
import settings as settings_mod
from controller import Controller, Payload, Result


class RemindersController(Controller):
    resource = "reminders"
    noun = "reminder"
    actions = ("index", "show", "store", "update", "destroy", "move")
    numbered = ("show", "update", "destroy", "move")

    def count(self, root: Path) -> int:
        return len(reminders._all(root))

    def index(self, root: Path, p: Payload) -> Result:
        rows, left = reminders.rows_response(root, all_of_them=bool(p.get("all")), cap=p.get("cap"),
                                             page=int(p.get("page", 1)), order=p.get("order", fmt.DESC))
        live = len(reminders.live(root))
        return Result("ok", "", rows, {"left": left, "live": live, "retired": self.count(root) - live})

    def show(self, root: Path, p: Payload) -> Result:
        rows, _ = reminders.rows_response(root, all_of_them=True)
        row = next(r for r in rows if r["n"] == p.id)
        return Result("ok", "", {**row, "until": reminders._all(root)[p.id - 1].get("until") or ""})

    def store(self, root: Path, p: Payload) -> Result:
        conf, _ = settings_mod.load(root)
        outcome = reminders.add(root, p.text("text"), p.at, conf["reminder_max_chars"], p.text("until"))
        return Result.of(outcome, created=True, meta={"every": conf["reminder_every"]})

    def update(self, root: Path, p: Payload) -> Result:
        conf, _ = settings_mod.load(root)
        was = reminders._all(root)[p.id - 1]
        text = p.text("text") if p.has("text") else was.get("text", "")
        until = p.text("until") if p.has("until") else was.get("until") or ""
        return Result.of(reminders.update(root, p.id, text, until, conf["reminder_max_chars"]))

    def destroy(self, root: Path, p: Payload) -> Result:
        return Result.of(reminders.done(root, p.id, p.text("why"), p.at))

    def move(self, root: Path, p: Payload) -> Result:
        return Result.of(reminders.move(root, p.id, p.text("environment"), p.at))
