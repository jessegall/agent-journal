import re
import time
from pathlib import Path

from controllers.types import Agents, Plugins, Todos
from engine.hooks import gate_file
from engine.stored import read_json, write_json
from features.plugins.lifecycle import called
from features.plugins.source import CHOSEN
from resources.base import PLUGIN, RAISED, Refused, SYSTEM, check_abstract, check_title

KEYS = ("whisper", "say", "notify", "notice", "todo", "hold", "settings", "raise")
MOST = 20
KEPT_CARDS = 50
COLOR = re.compile(r"^(#[0-9a-fA-F]{3,8}|[a-z]+)$")
HELD = "plugin"


def held(root: Path, env: str, session: str, plugin: str, why: str) -> None:
    f = gate_file(root, env, session)
    holds = read_json(f, {})
    key = f"{HELD}:{plugin}"
    if why:
        holds[key] = why
    else:
        holds.pop(key, None)
    write_json(f, holds)


def nudged(record, journal, plugin: str, session: str, text: str, private: bool) -> None:
    rows = Agents(record, actor=SYSTEM)
    row = next((r for r in rows._every() if r.title == session), None) if session else rows.primary()
    if row:
        journal.say(record, row, "plugin", private=private, actor=PLUGIN, title=plugin, brief=text, plugin=plugin)


def raised(record, plugin: str, session: str, fields: dict) -> None:
    row = next((r for r in Plugins(record, actor=PLUGIN)._standing() if called(r) == plugin), None)
    name = str(fields.get("event") or "")
    declared = ((row.manifest or {}).get("events") or {}).get(name) if row else None
    if not declared:
        raise Refused(f"{plugin} declares no event {name}")
    title, brief = str(declared.get("title") or name), str(fields.get("brief") or "")
    record.emit("plugin", row.n, RAISED, PLUGIN, event=f"{plugin}.{name}", title=title, tone=str(declared.get("tone") or ""), brief=brief, plugin=plugin)
    if isinstance(declared.get("card"), dict):
        carded(record, session, plugin, {"label": title, "tone": str(declared.get("tone") or ""), **declared["card"]}, brief)


def carded(record, session: str, plugin: str, look: dict, brief: str) -> None:
    agents = Agents(record, actor=SYSTEM)
    agent = next((r for r in agents._every() if r.title == session), None) if session else agents.primary()
    if not agent:
        return
    color = str(look.get("color") or "")
    card = {"at": time.time(), "plugin": plugin, "label": str(look.get("label") or plugin), "icon": str(look.get("icon") or "bell"), "tone": str(look.get("tone") or ""),
            "color": color if COLOR.match(color) else "", "detail": next((line.strip(" •-") for line in brief.splitlines() if line.strip()), "")}
    agents.update(agent.n, cards=[*(agent.data.get("cards") or []), card][-KEPT_CARDS:])


def settled(record, plugin: str, values: dict) -> None:
    rows = Plugins(record, actor=PLUGIN)
    row = next((r for r in rows._standing() if called(r) == plugin), None)
    if row is None:
        return
    known = (row.manifest or {}).get("settings") or {}
    kept = dict(row.settings or {})
    chosen = kept.get(CHOSEN) or {}
    found = {key: str(value) for key, value in values.items() if key in known and chosen.get(key) != str(value)}
    if found:
        rows.update(row.n, settings={**kept, CHOSEN: {**chosen, **found}})


def wanted(reply: dict) -> list[tuple[str, object]]:
    return [(key, reply[key]) for key in KEYS if key in reply][:MOST]


def apply(record, journal, plugin: str, session: str, reply: dict) -> list[str]:
    done = []
    for key, value in wanted(reply):
        try:
            one(record, journal, plugin, session, key, value)
        except Refused:
            continue
        done.append(key)
    return done


def one(record, journal, plugin: str, session: str, key: str, value) -> None:
    if key in ("whisper", "say"):
        nudged(record, journal, plugin, session, str(value), key == "whisper")
    elif key == "notify":
        notification = value if isinstance(value, dict) else {"title": str(value)}
        journal.notify(record, "plugin", actor=PLUGIN, title=check_title(str(notification.get("title") or "")), abstract=check_abstract(str(notification.get("abstract") or "")),
                       brief=str(notification.get("brief") or ""), about=notification.get("about") or None, plugin=plugin)
    elif key == "notice":
        fields = value if isinstance(value, dict) else {"title": str(value)}
        journal.notice(record, "plugin", actor=PLUGIN, title=check_title(str(fields.get("title") or "")), brief=str(fields.get("brief") or ""),
                       tone=fields.get("tone") or "", link=fields.get("link") or "", plugin=plugin)
    elif key == "raise":
        for fields in value if isinstance(value, list) else [value]:
            raised(record, plugin, session, fields if isinstance(fields, dict) else {"event": str(fields)})
    elif key == "settings" and isinstance(value, dict):
        settled(record, plugin, value)
    elif key == "todo":
        asked = value if isinstance(value, dict) else {"title": str(value)}
        Todos(record, actor=PLUGIN).create(check_title(str(asked.get("title") or "")), brief=str(asked.get("brief") or ""), plugin=plugin)
    elif key == "hold":
        held(record.root, record.env, session, plugin, str(value or ""))
