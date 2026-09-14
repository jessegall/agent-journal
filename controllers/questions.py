from __future__ import annotations

from pathlib import Path

import fmt
import questions
from controller import Controller, Payload, Result
from payloads import questions as question_payloads
from payloads.common import AnswerPayload, ListingPayload, TextPayload, WhyPayload


class QuestionsController(Controller):
    resource = "questions"
    noun = "question"
    actions = ("index", "show", "store", "update", "destroy", "answer", "link", "unlink", "seen")
    numbered = ("show", "update", "destroy", "answer", "link", "unlink", "seen")
    payloads = {"index": ListingPayload, "store": question_payloads.StorePayload, "update": question_payloads.UpdatePayload,
                "destroy": WhyPayload, "answer": AnswerPayload, "link": question_payloads.RefPayload,
                "unlink": question_payloads.RefPayload, "seen": Payload}

    def repository(self, root: Path, p: Payload):
        from resources import Questions
        return Questions(root, p.env)

    def _row(self, root: Path, p: Payload, n: int) -> dict:
        return questions.row_response(n, self.repository(root, p).find(n).raw)

    def index(self, root: Path, p: ListingPayload) -> Result:
        every = self.repository(root, p).all()
        query = self.repository(root, p).query()
        if not p.all:
            query = query.where(lambda q: not q.withdrawn)
        if p.sort:
            query = self.sorted(query, p)
            if isinstance(query, Result):
                return query
        else:
            # open ones first, then answered, each newest first unless asked otherwise
            query = query.order_by("n", p.order or fmt.DESC).order_by("status_order")
        page = self.paged(query, p)
        open_n = len([q for q in every if q.waiting])
        standing = len([q for q in every if not q.withdrawn])
        return Result("ok", "", [questions.row_response(q.n, q.raw) for q in page.rows],
                      {"left": page.left, "open": open_n, "answered": standing - open_n})

    def show(self, root: Path, p: Payload) -> Result:
        import inbox
        return Result("ok", "", {**self._row(root, p, p.id),
                                 "from_messages": inbox.sources(root, f"question:{p.id}", p.env or None)})

    def store(self, root: Path, p: question_payloads.StorePayload) -> Result:
        outcome = questions.add(root, p.text, p.at, p.about, source=p.source, description=p.description, options=p.options,
                                 pick=p.pick)
        data = self._row(root, p, self.repository(root, p).count()) if outcome[0] else None
        return Result.of(outcome, data, created=True)

    def update(self, root: Path, p: question_payloads.UpdatePayload) -> Result:
        outcome = questions.edit(root, p.id, p.text if p.has("text") else None,
                                 description=p.description if p.has("description") else None,
                                 options=p.options if p.has("options") else None,
                                 pick=p.pick if p.has("pick") else None)
        return Result.of(outcome, self._row(root, p, p.id))

    def seen(self, root: Path, p: Payload) -> Result:
        # the user opened it in the viewer: its Activity line stops asking for their attention
        from datetime import datetime, timezone
        at = p.at or datetime.now(timezone.utc).isoformat(timespec="seconds")
        return Result.of(questions.seen(root, p.id, at, p.env or None), self._row(root, p, p.id))

    def answer(self, root: Path, p: AnswerPayload) -> Result:
        # a new answer is added and the old one kept; the agent is told again
        return Result.of(questions.answer(root, p.id, p.answer, p.at), self._row(root, p, p.id))

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(questions.withdraw(root, p.id, p.why, p.at), self._row(root, p, p.id))

    def link(self, root: Path, p: question_payloads.RefPayload) -> Result:
        return Result.of(questions.link(root, p.id, p.ref), self._row(root, p, p.id))

    def unlink(self, root: Path, p: question_payloads.RefPayload) -> Result:
        return Result.of(questions.unlink(root, p.id, p.ref), self._row(root, p, p.id))
