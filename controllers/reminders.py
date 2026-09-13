from __future__ import annotations

from pathlib import Path

import reminders
import settings as settings_mod
import state
from controller import Controller, Payload, Result
from payloads.common import ListingPayload, MovePayload, WhyPayload
from payloads.reminders import ReminderPayload


class RemindersController(Controller):
    resource = "reminders"
    noun = "reminder"
    actions = ("index", "show", "store", "update", "destroy", "move")
    numbered = ("show", "update", "destroy", "move")
    payloads = {"index": ListingPayload, "store": ReminderPayload, "update": ReminderPayload,
                "destroy": WhyPayload, "move": MovePayload}

    def repository(self, root: Path, p: Payload):
        from resources import Reminders
        return Reminders(root, p.env)

    @staticmethod
    def _rows(root: Path) -> dict[int, dict]:
        return {r["n"]: r for r in reminders.rows_response(root, all_of_them=True)[0]}

    def index(self, root: Path, p: ListingPayload) -> Result:
        every = self.repository(root, p).all()
        query = self.repository(root, p).query()
        if not p.all:
            query = query.where(lambda r: r.standing)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page, rows = self.paged(query, p), self._rows(root)
        live = len([r for r in every if r.standing])
        conf, _ = settings_mod.load(root)
        return Result("ok", "", [{**rows[r.n], "until": r.until} for r in page.rows],
                      {"left": page.left, "live": live, "retired": len(every) - live,
                       "env": state.current_track(root), "every": conf["reminder_every"]})

    def show(self, root: Path, p: Payload) -> Result:
        import inbox
        return Result("ok", "", {**self._rows(root)[p.id], "until": self.repository(root, p).find(p.id).until,
                                 "from_messages": inbox.sources(root, f"reminder:{p.id}", p.env or None)})

    def store(self, root: Path, p: ReminderPayload) -> Result:
        conf, _ = settings_mod.load(root)
        outcome = reminders.add(root, p.text, p.at, conf["reminder_max_chars"], p.until)
        return Result.of(outcome, created=True, meta={"every": conf["reminder_every"]})

    def update(self, root: Path, p: ReminderPayload) -> Result:
        conf, _ = settings_mod.load(root)
        was = self.repository(root, p).find(p.id)
        text = p.text if p.has("text") else was.text
        until = p.until if p.has("until") else was.until
        return Result.of(reminders.update(root, p.id, text, until, conf["reminder_max_chars"]))

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(reminders.done(root, p.id, p.why, p.at))

    def move(self, root: Path, p: MovePayload) -> Result:
        return Result.of(reminders.move(root, p.id, p.environment, p.at))
