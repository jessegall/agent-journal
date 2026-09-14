from __future__ import annotations

from pathlib import Path

import pins
import settings as settings_mod
from controller import Controller, Payload, Result
from payloads import pins as pin_payloads
from payloads.common import ListingPayload, MovePayload, SectionPayload, WherePayload, WhyPayload
from templates import render

MESSAGES = {
    "nothing_to_change": "send a fact or a body to change",
    "doc_refused": "doc: {why}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class ClaimsController(Controller):
    key = pins.KEY
    payloads = {"index": ListingPayload, "store": pin_payloads.StorePayload, "update": pin_payloads.UpdatePayload,
                "destroy": WhyPayload, "amend": SectionPayload, "move": MovePayload, "promote": WherePayload}
    # a struck claim is the record of why it stopped holding
    EDITS = frozenset({"update", "destroy", "amend", "move", "promote"})

    def repository(self, root: Path, p: Payload):
        from resources import Pins
        return Pins(root, p.env)

    def guard(self, root: Path, action: str, p: Payload) -> Result | None:
        if action not in self.EDITS:
            return None
        claim = self.repository(root, p).find(p.id)
        if claim.struck:
            return Result("refused", pins.say("already_struck", noun=self.noun, n=p.id, why=claim.struck))
        return None

    def _rows(self, root: Path, p: Payload) -> dict[int, dict]:
        import views
        rows, _ = pins.rows_response(root, all_of_them=True, key=self.key, track=p.env or None)
        stored = pins._all(root, self.key, p.env or None)
        struck_at = lambda n: (stored[n - 1].get("struck_at") or "") if 1 <= n <= len(stored) and stored[n - 1].get("struck") else ""  # noqa: E731
        return {r["n"]: {**views._split_meta(r), "facts": r["meta"], "closed_at": struck_at(r["n"])} for r in rows}

    def _questions(self, root: Path, p: Payload) -> list[dict]:
        import views
        return views.questions_about(root, p.env, f"pin:{p.id}")

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        every = repo.all()
        query = repo.query() if p.all else repo.query().where(lambda c: c.standing)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page, rows = self.paged(query, p), self._rows(root, p)
        standing = len([c for c in every if c.standing])
        return Result("ok", "", [rows[c.n] for c in page.rows],
                      {"left": page.left, "standing": standing, "struck": len(every) - standing, "env": p.env})

    def show(self, root: Path, p: Payload) -> Result:
        import docs
        repo = self.repository(root, p)
        claim = repo.find(p.id)
        return Result("ok", "", {**self._rows(root, p)[p.id], "body": repo.reasoning(p.id), "age": pins.age(claim.at),
                                 "struck_why": claim.struck,
                                 "doc_label": docs.ref_label(root, claim.doc) if claim.doc else "",
                                 "questions": self._questions(root, p),
                                 "from_messages": __import__("inbox").sources(root, f"{self.noun}:{p.id}", p.env or None)})

    def store(self, root: Path, p: pin_payloads.StorePayload) -> Result:
        where = dict(p.where)
        if p.doc:
            import docs
            got, why = docs.normalize_ref(root, p.doc)
            if got is None:
                return Result("refused", say("doc_refused", why=why))
            where["doc"] = got
        conf, _ = settings_mod.load(root)
        outcome = pins.add(root, p.fact, p.at, conf["pin_max_chars"], p.supersedes, where, key=self.key, long=p.body)
        return Result.of(outcome, {"n": self.repository(root, p).count()} if outcome[0] else None, created=True)

    def update(self, root: Path, p: pin_payloads.UpdatePayload) -> Result:
        said, n = [], p.id
        if p.has("fact"):
            # a claim is never rewritten in place: the old one is struck and the new one takes a new number
            conf, _ = settings_mod.load(root)
            ok, message = pins.add(root, p.fact, p.at, conf["pin_max_chars"], p.id, dict(p.where), key=self.key)
            if not ok:
                return Result("refused", message)
            said.append(message)
            n = self.repository(root, p).count()
        if p.has("body"):
            ok, message = pins.write_body(root, n, p.body, self.key, p.at)
            if not ok:
                return Result("refused", message)
            said.append(message)
        if not said:
            return Result("refused", say("nothing_to_change"))
        return Result("ok", "\n".join(said), {"n": n})

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(pins.strike(root, p.id, p.why, key=self.key, at=p.at))

    def amend(self, root: Path, p: SectionPayload) -> Result:
        return Result.of(pins.amend_body(root, p.id, p.title, p.body, self.key, p.at))


class PinsController(ClaimsController):
    resource = "pins"
    noun = "pin"
    actions = ("index", "show", "store", "update", "destroy", "amend", "move", "promote")
    numbered = ("show", "update", "destroy", "amend", "move", "promote")

    def move(self, root: Path, p: MovePayload) -> Result:
        return Result.of(pins.move(root, p.id, p.environment, p.at))

    def promote(self, root: Path, p: WherePayload) -> Result:
        return Result.of(pins.promote(root, p.id, p.at, p.where or None))


class RulesController(ClaimsController):
    resource = "rules"
    noun = "rule"
    key = pins.RULES
    scoped = False
    actions = ("index", "show", "store", "update", "destroy", "amend", "inject", "uninject")
    numbered = ("show", "update", "destroy", "amend", "inject", "uninject")

    def repository(self, root: Path, p: Payload):
        from resources import Rules
        return Rules(root)

    def _rows(self, root: Path, p: Payload) -> dict[int, dict]:
        import claude_md
        inside = claude_md.injected(root)
        return {n: {**row, "in_claude_md": n in inside} for n, row in super()._rows(root, p).items()}

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        import claude_md
        result = super().destroy(root, p)
        if result.ok:
            claude_md.forget(root, p.id)
        return result

    def inject(self, root: Path, p: Payload) -> Result:
        import claude_md
        return Result.of(claude_md.inject(root, p.id))

    def uninject(self, root: Path, p: Payload) -> Result:
        import claude_md
        return Result.of(claude_md.uninject(root, p.id))

    def index(self, root: Path, p: ListingPayload) -> Result:
        import builtin
        result = super().index(root, p)
        if result.ok:
            conf, _ = settings_mod.load(root)
            result.meta["builtin"] = ([{"id": r["id"], "fact": r["fact"]} for r in builtin.RULES]
                                      if conf["builtin_rules"] else [])
        return result

    def _questions(self, root: Path, p: Payload) -> list[dict]:
        import views
        n = p.id
        return views.questions_everywhere(root, lambda ref: ref == f"rule:{n}")
