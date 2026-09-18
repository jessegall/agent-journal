from dataclasses import fields

from v2 import features
from v2.commands.generate import actions
from v2.controllers.base import Controller
from v2.controllers.types import CONTROLLERS
from v2.resources.base import ACTIONS, ACTORS, SCOPES, VIEWS, Resource
from v2.resources.types import PRIORITY, TYPES


def manifest() -> dict:
    return {
        "actions": list(ACTIONS),
        "actors": list(ACTORS),
        "views": list(VIEWS),
        "scopes": list(SCOPES),
        "priority": list(PRIORITY),
        "fields": [f.name for f in fields(Resource)],
        "methods": actions(Controller),
        "types": {name: {"title": c.title_, "abstract": c.abstract_, "help": c.help_, "view": c.view, "nav": c.nav, "scope": c.scope, "notify": list(c.notify), "spoken": c.spoken, "fields": c.fields, "labels": c.labels,
                         "names": dict(c.names), "methods": actions(CONTROLLERS[name])}
                  for name, c in TYPES.items()},
        "features": features.describe(),
    }
