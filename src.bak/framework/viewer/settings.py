from framework.loaded import FEATURES, settings_changed, switched
from controllers.features import check_choices, refuse_a_secret, refuse_a_secret_that_runs_commands, refuse_unmet_needs
from controllers.features import Features
from controllers.nudges import Nudges
from engine.record import Record
from engine.settings_file import PROJECT_PARTS
from declaring.registries import SETTINGS_APPLIED


def renamed() -> dict:
    return {(alias if isinstance(alias, str) else alias[0]):
            (name if isinstance(alias, str) else f"{name}.{alias[1]}")
            for name, f in FEATURES.items() for alias in f.aliases}


def switches(record: Record) -> dict:
    out = {}
    for name, f in FEATURES.items():
        out[name] = f.enabled(record)
        for key in f.behaviours:
            out[f.keyed(key)] = f.chosen(record, key)
    return {**out, **{was: out[now] for was, now in renamed().items() if now in out}}


def settings(record: Record) -> dict:
    return {Record.features: switches(record),
            Record.triggers: record.triggers, Record.keep: record.keep, Record.viewer: record.viewer,
            Record.said: record.said,
            **{name: view for name, f in FEATURES.items() if (view := f.settings_view(record)) is not None}}


def apply(record: Record, body: dict, actor: str) -> dict:
    for name, values in ((n, v) for n, v in body.items() if isinstance(v, dict)):
        check_choices(name, values)
        refuse_unmet_needs(record, name, values)
        refuse_a_secret(name, values, actor)
        refuse_a_secret_that_runs_commands(record, name, values)
    before = switches(record)
    for key, value in body.items():
        if key == Record.features and isinstance(value, dict):
            moved, rows = renamed(), Features(record, actor=actor)
            asked = {**{moved[name]: on for name, on in value.items() if name in moved}, **{name: on for name, on in value.items() if name not in moved}}
            for name in (name for name in asked if "." not in name):
                rows.switch(name, asked[name])
            record.set_setting(key, {**{n: o for n, o in record.features.items() if "." in n or n in PROJECT_PARTS.of(key)},
                                     **{n: o for n, o in asked.items() if "." in n}})
            continue
        if key in (Record.viewer, Record.said) and isinstance(value, dict):
            record.change_setting(key, value)
            continue
        record.set_setting(key, value)
    asked_switches = body[Record.features] if isinstance(body.get(Record.features), dict) else {}
    settings_changed(record, [*body, *asked_switches], actor)
    for applied in SETTINGS_APPLIED.each(record):
        applied(record)
    after = switches(record)
    switched(record, before, after, actor)
    aliases = renamed()
    turned = [f"{name} {'on' if on else 'off'}" for name, on in after.items() if name not in aliases and before.get(name) != on]
    if turned:
        Nudges(record, actor=actor).to_primary(f"the user turned {', '.join(turned)}", "journal settings shows every switch")
    return settings(record)
