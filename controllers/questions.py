from __future__ import annotations

from pathlib import Path

import fmt
import questions
from controller import Controller, Payload, Result


class QuestionsController(Controller):
    resource = "questions"
    noun = "question"
    actions = ("index", "show", "store", "update", "destroy", "answer", "link", "unlink")
    numbered = ("show", "update", "destroy", "answer", "link", "unlink")

    def count(self, root: Path) -> int:
        return len(questions._all(root))

    def _row(self, root: Path, n: int) -> dict:
        return questions.row_response(n, questions._all(root)[n - 1])

    def index(self, root: Path, p: Payload) -> Result:
        rows = [questions.row_response(n, q)
                for n, q in questions._ordered(root, bool(p.get("all")), p.get("order", fmt.DESC))]
        standing = len([q for q in questions._all(root) if not q.get("withdrawn")])
        open_n = len(questions.open_items(root))
        cap, page, left = p.get("cap"), int(p.get("page", 1)), 0
        if cap:
            left = max(0, len(rows) - page * cap)
            rows = rows[(page - 1) * cap:page * cap]
        return Result("ok", "", rows, {"left": left, "open": open_n, "answered": standing - open_n})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", self._row(root, p.id))

    def store(self, root: Path, p: Payload) -> Result:
        outcome = questions.add(root, str(p.get("text") or ""), p.at, list(p.get("about") or []), source=p.source)
        return Result.of(outcome, self._row(root, self.count(root)) if outcome[0] else None, created=True)

    def update(self, root: Path, p: Payload) -> Result:
        outcome = questions.edit(root, p.id, str(p.get("text") or ""))
        return Result.of(outcome, self._row(root, p.id))

    def answer(self, root: Path, p: Payload) -> Result:
        # a second answer replaces the first, which is kept, and the agent is told again
        outcome = questions.answer(root, p.id, str(p.get("answer") or ""), p.at)
        return Result.of(outcome, self._row(root, p.id))

    def destroy(self, root: Path, p: Payload) -> Result:
        return Result.of(questions.withdraw(root, p.id, p.text("why"), p.at), self._row(root, p.id))

    def link(self, root: Path, p: Payload) -> Result:
        return Result.of(questions.link(root, p.id, p.text("ref")), self._row(root, p.id))

    def unlink(self, root: Path, p: Payload) -> Result:
        return Result.of(questions.unlink(root, p.id, p.text("ref")), self._row(root, p.id))
