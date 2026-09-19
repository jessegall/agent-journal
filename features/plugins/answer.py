from pathlib import Path

from controllers.types import Agents, Notices, Notifications, Nudges, Todos
from engine.hooks import gate_file
from engine.stored import read_json, write_json
from resources.base import PLUGIN, Refused, SYSTEM, check_abstract, check_title, titled

KEYS = ("whisper", "say", "notify", "notice", "todo", "hold")
MOST = 20
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


def nudged(record, plugin: str, session: str, text: str, private: bool) -> None:
    rows = Agents(record, actor=SYSTEM)
    row = next((r for r in rows.all() if r.title == session), None) if session else rows.primary()
    if not row:
        return
    Nudges(record, actor=PLUGIN).create(titled(text), brief=text, session=row.title, private=private, plugin=plugin)


def wanted(reply: dict) -> list[tuple[str, object]]:
    return [(key, reply[key]) for key in KEYS if key in reply][:MOST]


def apply(record, plugin: str, session: str, reply: dict) -> list[str]:
    done = []
    for key, value in wanted(reply):
        try:
            one(record, plugin, session, key, value)
        except Refused:
            continue
        done.append(key)
    return done


def one(record, plugin: str, session: str, key: str, value) -> None:
    if key in ("whisper", "say"):
        nudged(record, plugin, session, str(value), key == "whisper")
    elif key == "notify":
        told = value if isinstance(value, dict) else {"title": str(value)}
        Notifications(record, actor=PLUGIN).create(check_title(str(told.get("title") or "")), abstract=check_abstract(str(told.get("abstract") or "")),
                                                   brief=str(told.get("brief") or ""), about=told.get("about") or None, plugin=plugin)
    elif key == "notice":
        shown = value if isinstance(value, dict) else {"title": str(value)}
        Notices(record, actor=PLUGIN).create(check_title(str(shown.get("title") or "")), brief=str(shown.get("brief") or ""),
                                             tone=shown.get("tone") or "", link=shown.get("link") or "", plugin=plugin)
    elif key == "todo":
        asked = value if isinstance(value, dict) else {"title": str(value)}
        Todos(record, actor=PLUGIN).create(check_title(str(asked.get("title") or "")), brief=str(asked.get("brief") or ""), plugin=plugin)
    elif key == "hold":
        held(record.root, record.env, session, plugin, str(value or ""))
