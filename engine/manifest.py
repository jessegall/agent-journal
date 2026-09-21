from dataclasses import fields
from pathlib import Path

import features
from commands.parser import actions
from controllers.base import Controller
from controllers.types import CONTROLLERS
from resources.base import ACTIONS, ACTORS, CLOSED, EVERY, OPEN, SCOPES, VIEWS, Resource
from resources.types import TYPES, priority
from engine import runtime
from engine.version import version


SHOWN = {OPEN: "Open", EVERY: "All"}


def tabs(kind) -> list[dict]:
    titles = {**SHOWN, CLOSED: kind.shown.get("completed", "Closed").split()[-1].capitalize()}
    return [{"key": key, "title": titles[key], "shows": key} for key in kind.filters]


def built() -> str:
    assets = Path(__file__).resolve().parents[1] / "web" / "dist" / "assets"
    return next((f.name for f in sorted(assets.glob("index-*.js"))), "") if assets.is_dir() else ""


def manifest(root: Path | None = None) -> dict:
    return {
        "project": root.resolve().parent.name if root else "",
        "environment": runtime.env(root) if root else runtime.DEFAULT_ENV,
        "version": version(),
        "build": built(),
        "actions": list(ACTIONS),
        "actors": list(ACTORS),
        "views": list(VIEWS),
        "scopes": list(SCOPES),
        "priority": priority(),
        "fields": [f.name for f in fields(Resource)],
        "methods": actions(Controller),
        "types": {name: {"title": c.title_, "abstract": c.abstract_, "help": c.help_, "view": c.view, "nav": c.nav, "scope": c.scope, "icon": c.icon, "attention": c.attention, "finished_is_news": c.finished_is_news, "clears": c.clears, "filters": tabs(c), "mirror": c.mirror, "closed_first": c.closed_first, "notify": list(c.notify), "spoken": c.spoken, "counted": c.counted, "fields": c.fields, "labels": c.labels,
                         "names": dict(c.names), "shown": dict(c.shown), "methods": actions(CONTROLLERS[name])}
                  for name, c in TYPES.items()},
        "features": features.describe(),
    }
