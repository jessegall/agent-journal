import re
from dataclasses import dataclass, replace
from pathlib import Path

from controllers.types import Agents, Plugins, Todos
from engine.hooks import gate_file
from engine.fields import Loaded
from engine.stored import read_json, write_json
from features.plugins.declared import declared, settings_of
from features.plugins.lifecycle import called
from resources.base import PLUGIN, RAISED, Refused, SYSTEM, check_abstract, check_title

KEYS = ("whisper", "say", "notify", "notice", "todo", "hold", "settings", "raise")
MOST = 20
COLOR = re.compile(r"^(#[0-9a-fA-F]{3,8}|[a-z]+)$")
HELD = "plugin"


@dataclass(frozen=True)
class Posting(Loaded):
    title: str = ""
    abstract: str = ""
    brief: str = ""
    about: str = ""
    tone: str = ""
    link: str = ""
    event: str = ""

    @classmethod
    def of(cls, value, key: str = "title") -> "Posting":
        if not isinstance(value, dict):
            return cls(**{"title": "", key: str(value)})
        return cls.from_json(value)


@dataclass(frozen=True)
class Look:
    label: str
    icon: str
    tone: str
    color: str


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


def raised(record, plugin: str, session: str, asked: Posting) -> None:
    row = next((r for r in Plugins(record, actor=PLUGIN)._standing() if called(r) == plugin), None)
    name = asked.event
    event = declared(row).event(name) if row else None
    if not event:
        raise Refused(f"{plugin} declares no event {name}")
    title = event.title if event.title else name
    record.emit("plugin", row.n, RAISED, PLUGIN, event=f"{plugin}.{name}", title=title, tone=event.tone, brief=asked.brief, plugin=plugin)
    if event.card:
        card = event.card
        carded(record, session, plugin, Look(card.label if card.label else title, card.icon, card.tone if card.tone else event.tone, card.color), asked.brief)


def carded(record, session: str, plugin: str, look: Look, brief: str) -> None:
    agents = Agents(record, actor=SYSTEM)
    agent = next((r for r in agents._every() if r.title == session), None) if session else agents.primary()
    if not agent:
        return
    agents.card(agent.n, plugin=plugin, label=look.label if look.label else plugin, icon=look.icon if look.icon else "bell", tone=look.tone,
                color=look.color if COLOR.match(look.color) else "", detail=next((line.strip(" •-") for line in brief.splitlines() if line.strip()), ""))


def settled(record, plugin: str, values: dict) -> None:
    rows = Plugins(record, actor=PLUGIN)
    row = next((r for r in rows._standing() if called(r) == plugin), None)
    if row is None:
        return
    known = {setting.key for setting in declared(row).settings}
    settings = settings_of(row)
    found = {key: str(value) for key, value in values.items() if key in known and settings.chosen.get(key) != str(value)}
    if found:
        rows.update(row.n, settings=replace(settings, chosen={**settings.chosen, **found}).to_json())


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
        posting = Posting.of(value)
        journal.notify(record, "plugin", actor=PLUGIN, title=check_title(posting.title), abstract=check_abstract(posting.abstract),
                       brief=posting.brief, about=posting.about if posting.about else None, plugin=plugin)
    elif key == "notice":
        posting = Posting.of(value)
        journal.notice(record, "plugin", actor=PLUGIN, title=check_title(posting.title), brief=posting.brief, tone=posting.tone, link=posting.link, plugin=plugin)
    elif key == "raise":
        for fields in value if isinstance(value, list) else [value]:
            raised(record, plugin, session, Posting.of(fields, "event"))
    elif key == "settings" and isinstance(value, dict):
        settled(record, plugin, value)
    elif key == "todo":
        posting = Posting.of(value)
        Todos(record, actor=PLUGIN).create(check_title(posting.title), brief=posting.brief, plugin=plugin)
    elif key == "hold":
        held(record.root, record.env, session, plugin, str(value) if value else "")
