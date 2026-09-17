from __future__ import annotations

import fmt
from app import now, refuse, root, stem
from command import Command, Parsed
from templates import render

NOUNS = (("connections", "connection"),)


def _conn():
    import connections
    return connections


def _track():
    import tracks
    return tracks.current(root(), stem())


TEXT = {
    "title": "CONNECTIONS OF THIS PROJECT",
    "sub": "{n} kept",
    "empty": "  Nothing is connected.",
    "lead": "Services this project can reach. A connection keeps the NAME of the environment variable "
            "holding its token, never the token — the journal is read back verbatim into every session, "
            "so a secret written here is a secret that has leaked.",
    "row": "{name}  —  {what}",
    "row_kind": "{kind}",
    "row_url": "{url}",
    "row_here": "{fields:, } set on {env}",
    "show_title": "CONNECTION {name}",
    "show_what": "what it is for",
    "show_kind": "kind",
    "show_url": "url",
    "show_secret": "secret",
    "show_project": "the project's own: {value}",
    "show_none": "not set",
    "commands": (
        ('journal connections add <name> "<what it is for>" --url= --secret=<ENV_VAR>', "keep one"),
        ("journal connections show <name>", "read one"),
        ('journal connections set <name> purpose|kind|url|secret "<value>"', "change it for the project"),
        ('journal connections here <name> purpose|kind|url|secret "<value>"', "change it on this environment only"),
        ('journal connections remove <name> "<why>"', "stop keeping it"),
    ),
}

FIELD_LABELS = (("purpose", "show_what"), ("kind", "show_kind"), ("url", "show_url"))


class List(Command):
    signature = "connections:list"
    default = True

    def run(self, p: Parsed) -> int:
        conn = _conn()
        rows = conn.all_of(root(), _track())
        fmt.say(fmt.title(TEXT["title"], sub=render(TEXT["sub"], n=len(rows))))
        fmt.say()
        if not rows:
            fmt.say(TEXT["empty"])
        for row in rows.values():
            fmt.say(render(TEXT["row"], name=row["name"], what=row.get("purpose") or ""))
            facts = [f for f in (row.get("kind"), row.get("url"), conn.secret_state(row)) if f]
            if row["overridden"]:
                facts.append(render(TEXT["row_here"], fields=row["overridden"], env=_track()))
            fmt.say("     " + fmt.dim(" · ".join(facts)))
        fmt.say()
        fmt.say(fmt.wrap(TEXT["lead"]))
        fmt.say(fmt.commands(list(TEXT["commands"])))
        return 0


class Show(Command):
    signature = "connections:show {name : the connection's name}"

    def run(self, p: Parsed) -> int:
        conn = _conn()
        row = conn.one(root(), p.arg("name"), _track())
        if not row:
            return refuse(conn.say("no_such", name=repr(p.arg("name"))))
        fmt.say(fmt.title(render(TEXT["show_title"], name=row["name"])))
        for field, label in FIELD_LABELS:
            fmt.say()
            fmt.say(fmt.dim(TEXT[label]))
            fmt.say("  " + (row.get(field) or TEXT["show_none"]))
            if field in row["overridden"]:
                fmt.say("  " + fmt.dim(render(TEXT["show_project"],
                                              value=row["project"].get(field) or TEXT["show_none"])))
        fmt.say()
        fmt.say(fmt.dim(TEXT["show_secret"]))
        fmt.say("  " + conn.secret_state(row))
        fmt.say()
        fmt.say(fmt.commands(list(TEXT["commands"])))
        return 0


class Add(Command):
    signature = ('connections:add {name : a short name} {what* : what it is for} '
                 '{--kind=} {--url=} {--secret=}')
    writes = True

    def run(self, p: Parsed) -> int:
        ok, message = _conn().add(root(), p.arg("name"), p.arg("what"), now(),
                                  kind=p.option("kind") or "", url=p.option("url") or "",
                                  secret=p.option("secret") or "")
        fmt.say(message, error=not ok)
        return 0 if ok else 1


class Set(Command):
    signature = "connections:set {name : the connection} {field : kind, url, secret or purpose} {value*? : the new value}"
    writes = True

    def run(self, p: Parsed) -> int:
        ok, message = _conn().set_field(root(), p.arg("name"), p.arg("field"), p.arg("value") or "")
        fmt.say(message, error=not ok)
        return 0 if ok else 1


class Here(Command):
    signature = ("connections:here {name : the connection} {field : kind, url, secret or purpose} "
                 "{value*? : the value on this environment} {--off}")
    writes = True

    def run(self, p: Parsed) -> int:
        env = _track()
        ok, message = _conn().override(root(), env, p.arg("name"), p.arg("field"),
                                       p.arg("value") or "", off=bool(p.option("off")))
        fmt.say(message, error=not ok)
        return 0 if ok else 1


class Remove(Command):
    signature = "connections:remove {name : the connection} {why*? : why it is gone}"
    writes = True

    def run(self, p: Parsed) -> int:
        ok, message = _conn().remove(root(), p.arg("name"), p.arg("why") or "", now())
        fmt.say(message, error=not ok)
        return 0 if ok else 1


COMMANDS = (List, Show, Add, Set, Here, Remove)
