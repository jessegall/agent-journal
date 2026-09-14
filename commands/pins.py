from __future__ import annotations

import re

import builtin
import fmt
import pins
import settings as settings_mod
import state
import transcript
from app import BRIEF_REFUSED, CATALOGUE_PAGE, brief, catalogue, doc_where, now, project, refuse, root, stem, where
from command import Command, Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.pins import PinsController, RulesController
from templates import render

NOUNS = (("pins", "pin"), ("rules", "rule"), ("strike",), ("promote",), ("nothing",))

PIN = {"n": number("a pin number")}
RULE = {"n": number("a rule number")}
PINS, RULES = PinsController(), RulesController()


def rule_id(word: str) -> str:
    if not re.fullmatch(r"\d+|[Bb]\d+", word.strip()):
        raise ValueError(render(TEXT["rule_id"], word=repr(word)))
    return word.strip()


TEXT = {
    "rule_id": "a rule number, or a shipped rule like B1, got {word}",
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
    "builtin_inject": "{id} ships with the journal and is already in CLAUDE.md's journal block; inject takes a rule "
                      "of this project, by number",
    "builtin_strike": "{id} is the journal's own rule, not this project's — it holds wherever the journal is "
                      "installed, so striking it here would be a local opinion wearing the tool's authority, "
                      "and no setting turns it off.",
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


def _items(rows: list[dict]) -> list:
    return [fmt.Item(n=r["n"], text=r["fact"], meta=r["facts"], struck=r["struck"]) for r in rows]


def _said(outcome: tuple[bool, str]) -> int:
    ok, message = outcome
    fmt.say(message, error=not ok)
    return 0 if ok else 1


def _claim_page(key: str, d: dict) -> int:
    noun = "rule" if key == pins.RULES else "pin"
    fmt.say(fmt.title(render(TEXT["claim_title"], noun=noun.upper(), n=d["n"]), sub=d["age"]))
    fmt.say()
    fmt.say(fmt.wrap(d["fact"]))
    if d["struck_why"]:
        fmt.say()
        fmt.say(fmt.wrap(render(TEXT["struck"], why=d["struck_why"])))
    if d["doc_label"]:
        fmt.say()
        fmt.say(render(TEXT["cites"], label=d["doc_label"]))
    fmt.say()
    fmt.say(d["body"].rstrip() if d["body"].strip() else fmt.wrap(TEXT["no_reasoning"]))
    fmt.say()
    fmt.say(fmt.commands([(render(c, key=key, n=d["n"]), w) for c, w in CLAIM_COMMANDS]))
    return 0


class _Show(Resource):
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        return _claim_page(self.controller.key, result.data)


class _Add(Resource):
    writes = True
    action = "store"
    how = "pinned"

    def extra(self, p: Parsed):
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        got = doc_where(p.option("doc") or "")
        if got is None:
            return 1
        return dict(body=body, doc=got.pop("doc", ""), where=got)

    def render(self, p: Parsed, result) -> int:
        code = super().render(p, result)
        if result.ok:
            _decided(self.how)
        return code


class _Body(Resource):
    writes = True

    def extra(self, p: Parsed):
        text = brief(bool(p.option("brief")))
        if text is None:
            return refuse(BRIEF_REFUSED)
        return {"body": text}


# ------------------------------------------------------------------ pins
class PinsAround(Command):
    signature = "pins {n : a pin number} {--full}"
    casts = PIN
    needs = ("full",)

    def run(self, p: Parsed) -> int:
        return _said(pins.around(root(), p.arg("n"), project(), settings_mod.load(root())[0]["pin_context"]))


class PinsList(Resource):
    signature = "pins:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = PINS
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        every, page, order = bool(p.option("all")), p.option("page"), p.option("order")
        sub = render(TEXT["pins_sub"], env=result.meta["env"], n=result.meta["standing"],
                     **_struck(every, result.meta["struck"]))
        code = catalogue("PINS", sub, (_items(result.data), result.meta["left"]), TEXT["pins_empty"],
                         TEXT["pins_lead"], PINS_COMMANDS, noun="pins", page=page, order=order)
        import context
        conf, _ = settings_mod.load(root())
        got = transcript.session_transcript(project())
        read = got and context.pressure(got[0], conf["context_window"], state.get(root(), "window", 0) or 0)
        if read:
            fmt.say(render(TEXT["context"], pct=f"{read[0]:.0%}", used=f"{read[1]:,}", window=f"{read[2]:,}")
                    if read[3] else render(TEXT["context_unknown"], used=f"{read[1]:,}"))
        return code


class PinsShow(_Show):
    signature = "pins:show {n : a pin number}"
    casts = PIN
    default = True
    controller = PINS


class PinsAdd(_Add):
    signature = "pins:add {fact* : the claim, in one line} {--supersedes=} {--doc=} {--brief}"
    casts = {"supersedes": number("--supersedes")}
    default = True
    controller = PINS


class PinsStrike(Resource):
    signature = "pins:strike {n : a pin number} {why* : why it stopped being true}"
    casts = PIN
    writes = True
    controller = PINS
    action = "destroy"


class PinsPromote(Resource):
    signature = "pins:promote {n : a pin number}"
    casts = PIN
    writes = True
    controller = PINS
    action = "promote"

    def extra(self, p: Parsed):
        return {"where": where()}


class PinsMove(Resource):
    signature = "pins:move {n : a pin number} {environment* : the environment it moves to}"
    casts = PIN
    writes = True
    controller = PINS
    action = "move"


class PinsAmend(_Body):
    signature = "pins:amend {n : a pin number} {title* : the section title} {--brief}"
    casts = PIN
    controller = PINS
    action = "amend"


class PinsReplace(_Body):
    signature = "pins:replace {n : a pin number} {--brief}"
    casts = PIN
    controller = PINS
    action = "update"


# ------------------------------------------------------------------ rules
class RulesAround(Command):
    signature = "rules {n : a rule number} {--full}"
    casts = RULE
    needs = ("full",)

    def run(self, p: Parsed) -> int:
        conf, _ = settings_mod.load(root())
        return _said(pins.around(root(), p.arg("n"), project(), conf["pin_context"], key=pins.RULES))


class RulesStrikeFlag(Resource):
    signature = "rules {n : a rule number} {why* : why it no longer binds} {--strike}"
    casts = RULE
    needs = ("strike",)
    writes = True
    controller = RULES
    action = "destroy"


class RulesList(Resource):
    signature = "rules:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = RULES
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        every, page, order = bool(p.option("all")), p.option("page"), p.option("order")
        sub = render(TEXT["rules_sub"], n=result.meta["standing"], **_struck(every, result.meta["struck"]))
        fmt.say(fmt.title(TEXT["rules_title"], sub=sub))
        fmt.say()
        if result.meta["standing"] + result.meta["struck"]:
            fmt.say(fmt.render(fmt.Out(items=tuple(_items(result.data)))) + fmt.more("rules", result.meta["left"], page, order))
        else:
            fmt.say(pins.say("no_rules"))
        shipped = result.meta["builtin"]
        if shipped:
            fmt.say()
            fmt.say(fmt.dim(render(TEXT["builtin_head"], n=len(shipped))))
            for r in shipped:
                fmt.say(fmt.numbered(r["id"], r["fact"]))
            fmt.say(fmt.dim(TEXT["builtin_foot"]))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["rules_lead"]))
        fmt.say(fmt.commands(list(RULES_COMMANDS)))
        return 0


class RulesShow(_Show):
    signature = "rules:show {id : a rule number, or a shipped rule like B1}"
    casts = {"id": rule_id}
    default = True
    controller = RULES
    id_arg = "id"

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
        return super().run(p)


class RulesAdd(_Add):
    signature = "rules:add {fact* : the ruling, in one line} {--doc=} {--brief}"
    default = True
    controller = RULES
    how = "ruled"


class RulesStrike(Resource):
    signature = "rules:strike {id : a rule number} {why* : why it no longer binds}"
    casts = {"id": rule_id}
    writes = True
    controller = RULES
    action = "destroy"
    id_arg = "id"

    def extra(self, p: Parsed):
        if builtin.by_id(p.arg("id")) or not p.arg("id").isdigit():
            return refuse(render(TEXT["builtin_strike"], id=p.arg("id").upper()))
        return {}


class RulesInject(Resource):
    signature = "rules:inject {id : a rule number}"
    casts = {"id": rule_id}
    writes = True
    controller = RULES
    action = "inject"
    id_arg = "id"

    def extra(self, p: Parsed):
        if not p.arg("id").isdigit():
            return refuse(render(TEXT["builtin_inject"], id=p.arg("id").upper()))
        return {}


class RulesUninject(RulesInject):
    signature = "rules:uninject {id : a rule number}"
    action = "uninject"


class RulesMove(Command):
    signature = "rules:move {rest*?}"
    writes = True

    def run(self, p: Parsed) -> int:
        return refuse(TEXT["rule_move"])


class RulesAmend(_Body):
    signature = "rules:amend {n : a rule number} {title* : the section title} {--brief}"
    casts = RULE
    controller = RULES
    action = "amend"


class RulesReplace(_Body):
    signature = "rules:replace {n : a rule number} {--brief}"
    casts = RULE
    controller = RULES
    action = "update"


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
            RulesAround, RulesStrikeFlag, RulesList, RulesShow, RulesAdd, RulesStrike, RulesInject, RulesUninject,
            RulesMove, RulesAmend,
            RulesReplace, Strike, Promote, Nothing)
