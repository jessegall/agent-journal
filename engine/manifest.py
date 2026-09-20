from dataclasses import fields
from pathlib import Path

import features
from commands.cli import actions
from controllers.base import Controller
from controllers.types import CONTROLLERS
from resources.base import ACTIONS, ACTORS, SCOPES, VIEWS, Resource
from resources.types import PRIORITY, TYPES


def manifest(root: Path | None = None) -> dict:
    env_file = root / "runtime" / "env" if root else None
    return {
        "project": root.resolve().parent.name if root else "",
        "environment": env_file.read_text().strip() if env_file and env_file.is_file() else "main",
        "version": next((f.read_text().strip() for f in ((Path(__file__).resolve().parents[1] / "VERSION"),) if f.is_file()), ""),
        "actions": list(ACTIONS),
        "actors": list(ACTORS),
        "views": list(VIEWS),
        "scopes": list(SCOPES),
        "priority": list(PRIORITY),
        "fields": [f.name for f in fields(Resource)],
        "methods": actions(Controller),
        "types": {name: {"title": c.title_, "abstract": c.abstract_, "help": c.help_, "view": c.view, "nav": c.nav, "scope": c.scope, "icon": c.icon, "attention": c.attention, "settled": c.settled, "mirror": c.mirror, "closed_first": c.closed_first, "notify": list(c.notify), "spoken": c.spoken, "counted": c.counted, "fields": c.fields, "labels": c.labels,
                         "names": dict(c.names), "shown": dict(c.shown), "methods": actions(CONTROLLERS[name])}
                  for name, c in TYPES.items()},
        "features": features.describe(),
    }
