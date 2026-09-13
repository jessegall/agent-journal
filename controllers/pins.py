from __future__ import annotations

from pathlib import Path

import pins
import settings as settings_mod
from controller import Controller, Payload, Result
from templates import render

MESSAGES = {
    "nothing_to_change": "send a fact or a body to change",
    "doc_refused": "doc: {why}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class ClaimsController(Controller):
    key = pins.KEY
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
        return {r["n"]: {**views._split_meta(r), "facts": r["meta"]} for r in rows}

    def _questions(self, root: Path, p: Payload) -> list[dict]:
        import views
        return views.questions_about(root, p.env, f"pin:{p.id}")

    def _where(self, root: Path, p: Payload) -> tuple[dict | None, str]:
        where = dict(p.get("where") or {})
        if p.text("doc"):
            import docs
            got, why = docs.normalize_ref(root, p.text("doc"))
            if got is None:
                return None, say("doc_refused", why=why)
            where["doc"] = got
        return where, ""

    def index(self, root: Path, p: Payload) -> Result:
        repo = self.repository(root, p)
        every = repo.all()
        query = repo.query() if p.get("all") else repo.query().where(lambda c: c.standing)
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
                                 "questions": self._questions(root, p)})

    def store(self, root: Path, p: Payload) -> Result:
        where, why = self._where(root, p)
        if where is None:
            return Result("refused", why)
        conf, _ = settings_mod.load(root)
        replaces = p.get("supersedes")
        outcome = pins.add(root, p.text("fact"), p.at, conf["pin_max_chars"], int(replaces) if replaces else None,
                           where, key=self.key, long=str(p.get("body") or ""))
        return Result.of(outcome, {"n": self.repository(root, p).count()} if outcome[0] else None, created=True)

    def update(self, root: Path, p: Payload) -> Result:
        said, n = [], p.id
        if p.has("fact"):
            # a claim is never rewritten in place: the old one is struck and the new one takes a new number
            conf, _ = settings_mod.load(root)
            ok, message = pins.add(root, p.text("fact"), p.at, conf["pin_max_chars"], p.id,
                                   dict(p.get("where") or {}), key=self.key)
            if not ok:
                return Result("refused", message)
            said.append(message)
            n = self.repository(root, p).count()
        if p.has("body"):
            ok, message = pins.write_body(root, n, str(p.get("body")), self.key, p.at)
            if not ok:
                return Result("refused", message)
            said.append(message)
        if not said:
            return Result("refused", say("nothing_to_change"))
        return Result("ok", "\n".join(said), {"n": n})

    def destroy(self, root: Path, p: Payload) -> Result:
        return Result.of(pins.strike(root, p.id, p.text("why"), key=self.key))

    def amend(self, root: Path, p: Payload) -> Result:
        return Result.of(pins.amend_body(root, p.id, p.text("title"), str(p.get("body") or ""), self.key, p.at))


class PinsController(ClaimsController):
    resource = "pins"
    noun = "pin"
    actions = ("index", "show", "store", "update", "destroy", "amend", "move", "promote")
    numbered = ("show", "update", "destroy", "amend", "move", "promote")

    def move(self, root: Path, p: Payload) -> Result:
        return Result.of(pins.move(root, p.id, p.text("environment"), p.at))

    def promote(self, root: Path, p: Payload) -> Result:
        return Result.of(pins.promote(root, p.id, p.at, p.get("where")))


class RulesController(ClaimsController):
    resource = "rules"
    noun = "rule"
    key = pins.RULES
    scoped = False
    actions = ("index", "show", "store", "update", "destroy", "amend")
    numbered = ("show", "update", "destroy", "amend")

    def repository(self, root: Path, p: Payload):
        from resources import Rules
        return Rules(root)

    def index(self, root: Path, p: Payload) -> Result:
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
