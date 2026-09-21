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
    titles = {**SHOWN, CLOSED: kind.event_labels.get("completed", "Closed").split()[-1].capitalize()}
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
        "types": {name: {"title": c.details.title, "abstract": c.details.abstract, "help": c.details.help, "view": c.view, "in_sidebar": c.in_sidebar, "scope": c.scope, "icon": c.icon, "needs_attention": c.needs_attention, "lists_completed_unread": c.lists_completed_unread, "cleared_by": c.cleared_by, "filters": tabs(c), "nested": c.nested, "closed_first": c.closed_first, "notified": list(c.notified), "typed_as_title": c.typed_as_title, "start_as_count": c.start_as_count, "fields": c.fields, "labels": c.labels,
                         "command_names": dict(c.command_names), "event_labels": dict(c.event_labels), "methods": actions(CONTROLLERS[name])}
                  for name, c in TYPES.items()},
        "features": features.describe(),
    }
