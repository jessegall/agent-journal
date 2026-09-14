from __future__ import annotations

from pathlib import Path

import settings as settings_mod
import suggestions
from controller import Controller, Payload, Result
from payloads import suggestions as suggestion_payloads
from payloads.common import ListingPayload, WhyPayload


class SuggestionsController(Controller):
    resource = "suggestions"
    noun = "suggestion"
    actions = ("index", "show", "store", "update", "accept", "adjust", "decline", "destroy")
    numbered = ("show", "update", "accept", "adjust", "decline", "destroy")
    payloads = {"index": ListingPayload, "store": suggestion_payloads.StorePayload,
                "update": suggestion_payloads.UpdatePayload, "accept": suggestion_payloads.NotePayload,
                "adjust": suggestion_payloads.ChangePayload, "decline": WhyPayload, "destroy": WhyPayload}

    def repository(self, root: Path, p: Payload):
        from resources import Suggestions
        return Suggestions(root, p.env)

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        every = repo.all()
        query = repo.query() if p.all else repo.query().where(lambda s: s.state == "open")
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [suggestions.row_response(s.n, s.raw) for s in page.rows],
                      {"left": page.left, "open": len([s for s in every if s.state == "open"]),
                       "decided": len([s for s in every if s.state != "open"])})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", suggestions.row_response(p.id, self.repository(root, p).find(p.id).raw))

    def store(self, root: Path, p: suggestion_payloads.StorePayload) -> Result:
        conf, _ = settings_mod.load(root)
        return Result.of(suggestions.add(root, p.title, p.body, p.at, p.about, source=p.source, track=p.env or None,
                                         despite=p.despite, because=p.because, cap=conf["suggestion_max_open"]),
                         created=True)

    def update(self, root: Path, p: suggestion_payloads.UpdatePayload) -> Result:
        return Result.of(suggestions.edit(root, p.id, p.title if p.has("title") else None,
                                          p.body if p.has("body") else None, track=p.env or None))

    def accept(self, root: Path, p: suggestion_payloads.NotePayload) -> Result:
        return Result.of(suggestions.accept(root, p.id, p.at, p.note, track=p.env or None))

    def adjust(self, root: Path, p: suggestion_payloads.ChangePayload) -> Result:
        return Result.of(suggestions.adjust(root, p.id, p.change, p.at, track=p.env or None))

    def decline(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(suggestions.decline(root, p.id, p.why, p.at, track=p.env or None))

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(suggestions.withdraw(root, p.id, p.why, p.at, track=p.env or None))
