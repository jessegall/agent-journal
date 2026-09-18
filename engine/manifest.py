from dataclasses import fields

import features
from commands.cli import actions
from controllers.base import Controller
from controllers.types import CONTROLLERS
from resources.base import ACTIONS, ACTORS, SCOPES, VIEWS, Resource
from resources.types import PRIORITY, TYPES


def manifest() -> dict:
    return {
        "actions": list(ACTIONS),
        "actors": list(ACTORS),
        "views": list(VIEWS),
        "scopes": list(SCOPES),
        "priority": list(PRIORITY),
        "fields": [f.name for f in fields(Resource)],
        "methods": actions(Controller),
        "types": {name: {"title": c.title_, "abstract": c.abstract_, "help": c.help_, "view": c.view, "nav": c.nav, "scope": c.scope, "icon": c.icon, "notify": list(c.notify), "spoken": c.spoken, "fields": c.fields, "labels": c.labels,
                         "names": dict(c.names), "methods": actions(CONTROLLERS[name])}
                  for name, c in TYPES.items()},
        "features": features.describe(),
    }
