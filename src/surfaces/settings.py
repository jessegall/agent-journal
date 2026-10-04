import features
from controllers.types import Features, Nudges
from engine.record import Record
from features.boards.agent_types import written
from features.session_briefing.block import rebuild


def renamed() -> dict:
    return {(alias if isinstance(alias, str) else alias[0]):
            (name if isinstance(alias, str) else f"{name}.{alias[1]}")
            for name, f in features.FEATURES.items() for alias in f.aliases}


def switches(record: Record) -> dict:
    out = {}
    for name, f in features.FEATURES.items():
        out[name] = f.enabled(record)
        for key in f.behaviours:
            out[f.keyed(key)] = f.chosen(record, key)
    return {**out, **{was: out[now] for was, now in renamed().items() if now in out}}


def settings(record: Record) -> dict:
    return {Record.features: switches(record),
            Record.triggers: record.triggers, Record.keep: record.keep, Record.delivery: record.delivery, Record.viewer: record.viewer,
            **{name: view for name, f in features.FEATURES.items() if (view := f.settings_view(record)) is not None}}


def apply(record: Record, body: dict, actor: str) -> dict:
    before = switches(record)
    for key, value in body.items():
        if key == Record.features and isinstance(value, dict):
            moved, rows = renamed(), Features(record, actor=actor)
            asked = {**{moved[name]: on for name, on in value.items() if name in moved}, **{name: on for name, on in value.items() if name not in moved}}
            for name in (name for name in asked if "." not in name):
                rows.switch(name, asked[name])
            record.set_setting(key, {**{n: o for n, o in record.features.items() if "." in n},
                                     **{n: o for n, o in asked.items() if "." in n}})
            continue
        if key == Record.viewer and isinstance(value, dict):
            record.set_setting(key, {**record.viewer, **value})
            continue
        record.set_setting(key, value)
    if "boards" in body:
        written(record.root.parent, record)
    rebuild(record)
    after = switches(record)
    aliases = renamed()
    turned = [f"{name} {'on' if on else 'off'}" for name, on in after.items() if name not in aliases and before.get(name) != on]
    if turned:
        Nudges(record, actor=actor)._to_primary(f"the user turned {', '.join(turned)}", "journal settings shows every switch")
    return settings(record)
