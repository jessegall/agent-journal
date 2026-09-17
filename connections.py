from __future__ import annotations

import os
import re
from pathlib import Path

import state
from templates import render as fill

#: the project's list, and the per-environment overrides. Two keys, because one name cannot be
#: both a record key and a tracked one — and they answer two different questions.
KEY = "connections"
OVERRIDES = "connection_overrides"
GONE = "connections_removed"

FIELDS = ("kind", "url", "secret", "purpose")
#: `for` is a keyword everywhere a field becomes a name, so the field is `purpose` and `for`
#: is the word the CLI also answers to, because it is what the sentence wants.
ALIASES = {"for": "purpose"}
SETTABLE = FIELDS

MESSAGES = {
    "needs_name": 'a connection needs a name: journal connections add <name> "<what it is for>"',
    "needs_for": 'say what it is for — the one line every session is handed:\n'
                 '  journal connections add {name} "<what it is for>" --url="<base url>" --secret=<ENV_VAR>',
    "exists": "a connection named {name} is already kept. `journal connections {name}` reads it.",
    "no_such": "there is no connection named {name}. `journal connections` lists them.",
    "not_a_field": "a connection has kind, url, secret and purpose; not {field}",
    "looks_secret": "--secret names the ENVIRONMENT VARIABLE that holds the token, not the token. {why}\n"
                    "  The journal is read back verbatim into every session and subagent, so a token written "
                    "here is a token that has leaked. Put it in the environment and name the variable:\n"
                    '  journal connections set {name} secret SENTRY_AUTH_TOKEN',
    "added": "connection {name}: {what}",
    "set": "connection {name}: {field} is now {value}",
    "cleared": "connection {name}: {field} is no longer set",
    "here": "connection {name} on {env}: {field} is {value} here, {was} for the project",
    "here_off": "connection {name} on {env}: back to the project's own {field}",
    "here_nothing": "connection {name} has nothing overridden on {env}",
    "removed": "connection {name} is no longer kept: {why}",
    "needs_why": 'say why: journal connections remove {name} "<why it is gone>"',
    "secret_set": "{var} is set in this shell",
    "secret_unset": "{var} is NOT set in this shell",
    "secret_none": "no secret named",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


#: what a value must not look like. A connection stores the NAME of the variable holding a
#: token, never the token, so anything with the shape of one is refused where it is typed.
_TOKEN_PREFIX = ("sk-", "ghp_", "gho_", "github_pat_", "xox", "sntrys_", "glpat-", "AKIA", "Bearer ")
_ENV_NAME = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def secretish(value: str) -> str:
    """Why this value looks like a token rather than a variable name, or "".

    THE CHECK IS ON SHAPE, NOT ON A LIST OF VENDORS. A name of an environment variable is short,
    has no punctuation and no lowercase-and-digit soup; a token is long, mixed and often carries a
    prefix that says exactly what it is. Either test catching it is enough to refuse.
    """
    got = (value or "").strip()
    if not got:
        return ""
    if got.startswith(_TOKEN_PREFIX):
        return "It starts the way a token does."
    if not _ENV_NAME.match(got):
        return "A variable name is letters, digits and underscores."
    if len(got) > 64:
        return "It is longer than any variable name needs to be."
    return ""


def _project(root: Path) -> dict:
    got = state.get(root, KEY, {})
    return dict(got) if isinstance(got, dict) else {}


def _here(root: Path, track: str | None) -> dict:
    got = state.tracked(root, OVERRIDES, track, {}) if track else state.get(root, OVERRIDES, {})
    return dict(got) if isinstance(got, dict) else {}


def all_of(root: Path, track: str | None = None) -> dict:
    """Every connection this environment can reach: the project's, with this environment's on top.

    THE PROJECT KEEPS THE LIST AND AN ENVIRONMENT MAY DISAGREE WITH IT — a staging url here, a
    different token variable there — without either forking the list or hiding what it overrode.
    So an override is a patch of FIELDS, never a whole entry: nothing can exist only here, and
    what it changed is always readable beside what it changed it from.
    """
    out = {}
    here = _here(root, track)
    for name, got in sorted(_project(root).items()):
        row = dict(got)
        patch = here.get(name) or {}
        row["overridden"] = sorted(k for k in patch if k in FIELDS and patch[k] != got.get(k))
        row["project"] = {k: got.get(k, "") for k in FIELDS}
        row.update({k: v for k, v in patch.items() if k in FIELDS})
        row["name"] = name
        out[name] = row
    return out


def one(root: Path, name: str, track: str | None = None) -> dict | None:
    return all_of(root, track).get(state.slug(name))


def add(root: Path, name: str, what: str, at: str, kind: str = "", url: str = "",
        secret: str = "", source: str = "cli") -> tuple[bool, str]:
    name = state.slug(name)
    if not name:
        return False, say("needs_name")
    what = " ".join((what or "").split())
    if not what:
        return False, say("needs_for", name=name)
    if why := secretish(secret):
        return False, say("looks_secret", name=name, why=why)
    with state.locked(root):
        got = _project(root)
        if name in got:
            return False, say("exists", name=name)
        got[name] = {"kind": " ".join((kind or "").split()), "url": (url or "").strip(),
                     "secret": (secret or "").strip(), "purpose": what, "at": at, "source": source}
        state.put(root, KEY, got)
    return True, say("added", name=name, what=what)


def _field(name: str) -> str:
    got = (name or "").strip().lower()
    return ALIASES.get(got, got)


def set_field(root: Path, name: str, field: str, value: str) -> tuple[bool, str]:
    name, field = state.slug(name), _field(field)
    if field not in SETTABLE:
        return False, say("not_a_field", field=repr(field))
    if field == "secret" and (why := secretish(value)):
        return False, say("looks_secret", name=name, why=why)
    with state.locked(root):
        got = _project(root)
        if name not in got:
            return False, say("no_such", name=name)
        got[name][field] = " ".join((value or "").split())
        state.put(root, KEY, got)
    return True, (say("set", name=name, field=field, value=got[name][field]) if got[name][field]
                  else say("cleared", name=name, field=field))


def override(root: Path, track: str, name: str, field: str, value: str,
             off: bool = False) -> tuple[bool, str]:
    """Change one field of one connection on this environment only."""
    name, field = state.slug(name), _field(field)
    if field not in SETTABLE:
        return False, say("not_a_field", field=repr(field))
    if field == "secret" and not off and (why := secretish(value)):
        return False, say("looks_secret", name=name, why=why)
    with state.locked(root):
        if name not in _project(root):
            return False, say("no_such", name=name)
        here = _here(root, track)
        patch = dict(here.get(name) or {})
        if off:
            if field not in patch:
                return False, say("here_nothing", name=name, env=track)
            patch.pop(field)
        else:
            patch[field] = " ".join((value or "").split())
        here[name] = patch
        if not patch:
            here.pop(name)
        state.put_tracked(root, OVERRIDES, track, here)
    was = _project(root)[name].get(field, "") or "nothing"
    return True, (say("here_off", name=name, env=track, field=field) if off
                  else say("here", name=name, env=track, field=field, value=patch[field], was=was))


def remove(root: Path, name: str, why: str, at: str) -> tuple[bool, str]:
    name, why = state.slug(name), " ".join((why or "").split())
    if not why:
        return False, say("needs_why", name=name)
    with state.locked(root):
        got = _project(root)
        if name not in got:
            return False, say("no_such", name=name)
        gone = got.pop(name)
        state.put(root, KEY, got)
        # INSIDE THE TAKE. Removing it and recording that it went are one act; split across two,
        # a second remover can land between them and the log loses an entry.
        _log_removal(root, name, gone, why, at)
    return True, say("removed", name=name, why=why)


def _log_removal(root: Path, name: str, gone: dict, why: str, at: str) -> None:
    """Nothing goes without a note saying what it was and why — as removing an environment leaves one.

    ITS OWN LOG, NOT `removals`. That one holds environment removals, with a shape of their own and
    a cap of their own; a second shape in the same list would evict them and would have to be told
    apart by whichever reader came next.
    """
    got = state.get(root, GONE, [])
    got = list(got) if isinstance(got, list) else []
    got.append({"name": name, "why": why, "at": at, "was": gone})
    state.put(root, GONE, got[-50:])


def secret_state(row: dict) -> str:
    """Whether the variable this connection names is set HERE — never what is in it."""
    var = (row or {}).get("secret") or ""
    if not var:
        return say("secret_none")
    return say("secret_set", var=var) if os.environ.get(var) else say("secret_unset", var=var)
