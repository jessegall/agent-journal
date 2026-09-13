from __future__ import annotations

import re

import builtin
import fmt
import pins
import settings as settings_mod
import state
import tracks
import transcript
from app import (BRIEF_REFUSED, CATALOGUE_PAGE, answer, brief, catalogue, doc_where, now, project,
                 refuse, root, stem, where)
from command import Command, Parsed, number
from commands.options import LISTING, LISTING_CASTS
from templates import render

NOUNS = (("pins", "pin"), ("rules", "rule"), ("strike",), ("promote",), ("nothing",))

PIN = {"n": number("a pin number")}
RULE = {"n": number("a rule number")}


def rule_id(word: str) -> str:
    if not re.fullmatch(r"\d+|[Bb]\d+", word.strip()):
        raise ValueError(f"a rule number, or a shipped rule like B1, got {word!r}")
    return word.strip()


TEXT = {
    "pins_sub": "environment {env} · {n} standing[ · {struck} struck][{hint}]",
    "pins_empty": "Nothing is pinned.",
    "pins_lead": "Handed to every session on this environment.",
    "context": "Context {pct} full ({used} of {window}).",
    "context_unknown": "Context: {used} tokens; the window is learned at the first compaction, or set "
                       "context_window in .journal/settings.json.",
    "struck_hint": " (--all shows them)",
    "rules_title": "RULES OF THIS PROJECT",
    "rules_sub": "{n} in force, on every environment[ · {struck} struck][{hint}]",
    "rules_lead": "Handed to every session, before anything else.",
    "builtin_head": "  THE JOURNAL'S OWN — {n}, in every project that installs it",
    "builtin_foot": "       they cannot be struck; `journal rules show B1` reads the reasoning",
    "builtin_title": "RULE {id}",
    "builtin_sub": "the journal's own, in every project",
    "builtin_strike": "{id} is the journal's own rule, not this project's — it holds wherever the journal is "
                      "installed, so striking it here would be a local opinion wearing the tool's authority. "
                      "`builtin_rules: false` in settings.json turns them all off.",
    "rule_move": "a rule binds EVERY environment, so there is nowhere to move it to. If it only describes one "
                 "line of work it was never a rule: strike it and pin it there —\n"
                 '  journal rules strike <n> "<why>"\n  journal pins add "<the claim>"',
    "no_claim": "there is no {noun} {n}. `journal {key}` numbers them.",
    "claim_title": "{noun} {n}",
    "struck": "STRUCK: {why}",
    "cites": "  → {label}",
    "no_reasoning": "No reasoning is written down. The claim is all there is, which is fine — and if the "
                    "argument matters, this is where it goes.",
    "nothing_needs_reason": 'nothing wants a reason: journal nothing "<why nothing here needs pinning>"',
    "nothing_noted": "noted — nothing pinned at this rung, because: {why}",
    "nothing_no_session": "this process cannot tell which session it is — no transcript for {env} was found — "
                          "so the decision was NOT filed. Run it from inside the session, or `journal verify` "
                          "to see what the hook sees",
    "nothing_not_due": "no pin is due — no context warning is waiting on a decision",
}

PINS_COMMANDS = (("journal pins <n> --full", "the conversation around one"),
                 ("journal pins promote <n>", "make one a rule for every environment"),
                 ('journal pins strike <n> "<why>"', "retire one that stopped being true"))
RULES_COMMANDS = (("journal rules <n> --full", "the conversation around one"),
                  ('journal rules strike <n> "<why>"', "repeal one"))
CLAIM_COMMANDS = (("journal {key} {n} --full", "the conversation it was written in"),
                  ('journal {key} amend {n} "<section title>" --brief', "add a section to the reasoning"),
                  ("journal {key} replace {n} --brief", "replace the reasoning outright"))


def _decided(how: str) -> bool:
    s = stem()
    due = state.get(root(), "pin_due", None, stem=s) if s else None
    if not due:
        return False
    state.put(root(), "pin_due", None, stem=s)
    state.put(root(), "pin_decided", {**due, "how": how, "at": now()}, stem=s)
    return True


def _struck(every: bool, struck: int) -> dict:
    return {"struck": struck or None, "hint": TEXT["struck_hint"] if struck and not every else None}


def _add(key: str, fact: str, supersedes: int | None, doc_ref: str, long_flag: bool, how: str) -> int:
    body = brief(long_flag)
    if body is None:
        return refuse(BRIEF_REFUSED)
    got = doc_where(doc_ref or "")
    if got is None:
        return 1
    conf, _ = settings_mod.load(root())
    ok, msg = pins.add(root(), fact, now(), conf["pin_max_chars"], supersedes, got, key=key, long=body)
    code = answer((ok, msg))
    if ok:
        _decided(how)
    return code


def _around(key: str, n: int) -> int:
    conf, _ = settings_mod.load(root())
    return answer(pins.around(root(), n, project(), conf["pin_context"], key=key))


def _body(key: str, n: int, title: str, long_flag: bool, verb: str) -> int:
    text = brief(long_flag)
    if text is None:
        return refuse(BRIEF_REFUSED)
    if verb == "amend":
        return answer(pins.amend_body(root(), n, title, text, key, now()))
    return answer(pins.write_body(root(), n, text, key, now()))


def _claim_page(key: str, n: int) -> int:
    import docs
    items = pins._all(root(), key)
    noun = "rule" if key == pins.RULES else "pin"
    if n < 1 or n > len(items):
        return refuse(render(TEXT["no_claim"], noun=noun, n=n, key=key))
    it = items[n - 1]
    fmt.say(fmt.title(render(TEXT["claim_title"], noun=noun.upper(), n=n), sub=pins.age(it.get("at", ""))))
    fmt.say()
    fmt.say(fmt.wrap(it["fact"]))
    if it.get("struck"):
        fmt.say()
        fmt.say(fmt.wrap(render(TEXT["struck"], why=it["struck"])))
    if it.get("doc"):
        fmt.say()
        fmt.say(render(TEXT["cites"], label=docs.ref_label(root(), str(it["doc"]))))
    long = pins.body(root(), n, key)
    fmt.say()
    fmt.say(long.rstrip() if long.strip() else fmt.wrap(TEXT["no_reasoning"]))
    fmt.say()
    fmt.say(fmt.commands([(render(c, key=key, n=n), w) for c, w in CLAIM_COMMANDS]))
    return 0


# ------------------------------------------------------------------ pins
class PinsAround(Command):
    signature = "pins {n : a pin number} {--full}"
    casts = PIN
    needs = ("full",)

    def run(self, p: Parsed) -> int:
        return _around(pins.KEY, p.arg("n"))


class PinsList(Command):
    signature = "pins:list " + LISTING
    casts = LISTING_CASTS
    default = True

    def run(self, p: Parsed) -> int:
        conf, _ = settings_mod.load(root())
        every = bool(p.option("all"))
        page, order = p.option("page"), p.option("order")
        n = len(pins.live(root()))
        sub = render(TEXT["pins_sub"], env=tracks.current(root(), stem()), n=n,
                     **_struck(every, len(pins._all(root())) - n))
        code = catalogue("PINS", sub,
                         pins.listing(root(), all_of_them=every, cap=CATALOGUE_PAGE, page=page, order=order),
                         TEXT["pins_empty"], TEXT["pins_lead"], PINS_COMMANDS, noun="pins", page=page, order=order)
        import context
        got = transcript.session_transcript(project())
        read = got and context.pressure(got[0], conf["context_window"], state.get(root(), "window", 0) or 0)
        if read:
            fmt.say(render(TEXT["context"], pct=f"{read[0]:.0%}", used=f"{read[1]:,}", window=f"{read[2]:,}")
                    if read[3] else render(TEXT["context_unknown"], used=f"{read[1]:,}"))
        return code


class PinsShow(Command):
    signature = "pins:show {n : a pin number}"
    casts = PIN
    default = True

    def run(self, p: Parsed) -> int:
        return _claim_page(pins.KEY, p.arg("n"))


class PinsAdd(Command):
    signature = "pins:add {fact* : the claim, in one line} {--supersedes=} {--doc=} {--brief}"
    casts = {"supersedes": number("--supersedes")}
    default = True
    writes = True

    def run(self, p: Parsed) -> int:
        return _add(pins.KEY, p.arg("fact"), p.option("supersedes"), p.option("doc"), bool(p.option("brief")), "pinned")


class PinsStrike(Command):
    signature = "pins:strike {n : a pin number} {why* : why it stopped being true}"
    casts = PIN
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(pins.strike(root(), p.arg("n"), p.arg("why")))


class PinsPromote(Command):
    signature = "pins:promote {n : a pin number}"
    casts = PIN
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(pins.promote(root(), p.arg("n"), now(), where()))


class PinsMove(Command):
    signature = "pins:move {n : a pin number} {environment* : the environment it moves to}"
    casts = PIN
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(pins.move(root(), p.arg("n"), p.arg("environment"), now()))


class PinsAmend(Command):
    signature = "pins:amend {n : a pin number} {title* : the section title} {--brief}"
    casts = PIN
    writes = True

    def run(self, p: Parsed) -> int:
        return _body(pins.KEY, p.arg("n"), p.arg("title"), bool(p.option("brief")), "amend")


class PinsReplace(Command):
    signature = "pins:replace {n : a pin number} {--brief}"
    casts = PIN
    writes = True

    def run(self, p: Parsed) -> int:
        return _body(pins.KEY, p.arg("n"), "", bool(p.option("brief")), "replace")


# ------------------------------------------------------------------ rules
class RulesAround(Command):
    signature = "rules {n : a rule number} {--full}"
    casts = RULE
    needs = ("full",)

    def run(self, p: Parsed) -> int:
        return _around(pins.RULES, p.arg("n"))


class RulesStrikeFlag(Command):
    signature = "rules {n : a rule number} {why* : why it no longer binds} {--strike}"
    casts = RULE
    needs = ("strike",)
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(pins.strike(root(), p.arg("n"), p.arg("why"), key=pins.RULES))


class RulesList(Command):
    signature = "rules:list " + LISTING
    casts = LISTING_CASTS
    default = True

    def run(self, p: Parsed) -> int:
        every = bool(p.option("all"))
        page, order = p.option("page"), p.option("order")
        live = len(pins.live(root(), pins.RULES))
        sub = render(TEXT["rules_sub"], n=live, **_struck(every, len(pins._all(root(), pins.RULES)) - live))
        fmt.say(fmt.title(TEXT["rules_title"], sub=sub))
        fmt.say()
        fmt.say(pins.render(root(), all_of_them=every, key=pins.RULES, cap=CATALOGUE_PAGE, page=page, order=order))
        conf, _ = settings_mod.load(root())
        if conf["builtin_rules"] and builtin.RULES:
            fmt.say()
            fmt.say(fmt.dim(render(TEXT["builtin_head"], n=len(builtin.RULES))))
            for r in builtin.RULES:
                fmt.say(fmt.numbered(r["id"], r["fact"]))
            fmt.say(fmt.dim(TEXT["builtin_foot"]))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["rules_lead"]))
        fmt.say(fmt.commands(list(RULES_COMMANDS)))
        return 0


class RulesShow(Command):
    signature = "rules:show {id : a rule number, or a shipped rule like B1}"
    casts = {"id": rule_id}
    default = True

    def run(self, p: Parsed) -> int:
        shipped = builtin.by_id(p.arg("id"))
        if shipped:
            fmt.say(fmt.title(render(TEXT["builtin_title"], id=shipped["id"]), sub=TEXT["builtin_sub"]))
            fmt.say()
            fmt.say(fmt.wrap(shipped["fact"]))
            fmt.say()
            fmt.say(fmt.block(shipped["body"]))
            return 0
        if not p.arg("id").isdigit():
            return refuse(render(TEXT["no_claim"], noun="rule", n=p.arg("id"), key=pins.RULES))
        return _claim_page(pins.RULES, int(p.arg("id")))


class RulesAdd(Command):
    signature = "rules:add {fact* : the ruling, in one line} {--doc=} {--brief}"
    default = True
    writes = True

    def run(self, p: Parsed) -> int:
        return _add(pins.RULES, p.arg("fact"), None, p.option("doc"), bool(p.option("brief")), "ruled")


class RulesStrike(Command):
    signature = "rules:strike {id : a rule number} {why* : why it no longer binds}"
    casts = {"id": rule_id}
    writes = True

    def run(self, p: Parsed) -> int:
        if builtin.by_id(p.arg("id")) or not p.arg("id").isdigit():
            return refuse(render(TEXT["builtin_strike"], id=p.arg("id").upper()))
        return answer(pins.strike(root(), int(p.arg("id")), p.arg("why"), key=pins.RULES))


class RulesMove(Command):
    signature = "rules:move {rest*?}"
    writes = True

    def run(self, p: Parsed) -> int:
        return refuse(TEXT["rule_move"])


class RulesAmend(Command):
    signature = "rules:amend {n : a rule number} {title* : the section title} {--brief}"
    casts = RULE
    writes = True

    def run(self, p: Parsed) -> int:
        return _body(pins.RULES, p.arg("n"), p.arg("title"), bool(p.option("brief")), "amend")


class RulesReplace(Command):
    signature = "rules:replace {n : a rule number} {--brief}"
    casts = RULE
    writes = True

    def run(self, p: Parsed) -> int:
        return _body(pins.RULES, p.arg("n"), "", bool(p.option("brief")), "replace")


# ------------------------------------------------------------------ bare verbs
class Strike(PinsStrike):
    signature = "strike {n : a pin number} {why* : why it stopped being true}"


class Promote(PinsPromote):
    signature = "promote {n : a pin number}"


class Nothing(Command):
    signature = "nothing {why*? : why nothing here needs pinning}"
    writes = True

    def run(self, p: Parsed) -> int:
        why = " ".join((p.arg("why") or "").split())
        if not why:
            return refuse(TEXT["nothing_needs_reason"])
        if _decided("declined: " + why):
            fmt.say(render(TEXT["nothing_noted"], why=why))
            return 0
        if not stem():
            return refuse(render(TEXT["nothing_no_session"], env=transcript.SESSION_ENV))
        return refuse(TEXT["nothing_not_due"])


COMMANDS = (PinsAround, PinsList, PinsShow, PinsAdd, PinsStrike, PinsPromote, PinsMove, PinsAmend, PinsReplace,
            RulesAround, RulesStrikeFlag, RulesList, RulesShow, RulesAdd, RulesStrike, RulesMove, RulesAmend,
            RulesReplace, Strike, Promote, Nothing)
