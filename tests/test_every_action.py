import inspect

import features
from commands.cli import actions
from controllers.types import CONTROLLERS
from resources.base import Refused, SYSTEM, USER
from resources.types import TYPES
from tests.conftest import fresh

WORLD = ("run", "install", "uninstall", "upgrade", "services", "archive_file", "pickup", "unarchive", "ask")
SAID = {"title": "a row worth keeping", "text": "a line of words", "body": "the body", "why": "it stopped being true",
        "how": "it landed", "name": "a name", "term": "row", "what": "what it is", "word": "done",
        "question": "which way", "part": "their words", "became": "todo:1", "value": "high", "face": "\U0001f44d",
        "env": "main", "kind": "note", "ref": "todo:1", "tags": "one two", "abstract": "one line",
        "brief": "why, and where to start", "outcome": "done", "message": "a log line", "actor": USER,
        "to": "agent-1", "by": 1, "how_": "it landed", "action": "create", "type": "todo", "session": "s-1"}
COUNTED = ("n", "m", "p", "waits", "doc", "plan", "on", "days", "last", "back", "page")


def given(controller, parameter: inspect.Parameter, row):
    said = str(parameter.annotation)
    if said.startswith("list"):
        return [row.n] if "int" in said else ["a word"]
    if parameter.name in COUNTED:
        return row.n if parameter.name in ("n", "m", "waits", "doc", "plan") else 1
    if parameter.name in SAID:
        return SAID[parameter.name]
    if said.endswith("int"):
        return 1
    if said.endswith("bool"):
        return False
    return "a word"


def call(controller, name, row):
    fn = controller.action(controller.resource.names.get(name, name))
    parameters = [p for p in inspect.signature(fn).parameters.values() if p.name != "self"]
    args = [given(controller, p, row) for p in parameters
            if p.kind in (p.POSITIONAL_ONLY, p.POSITIONAL_OR_KEYWORD) and p.default is p.empty]
    return fn(*args)


def test_every_action_of_every_resource_runs_or_refuses_in_words():
    features.load()
    broke = []
    for type_ in TYPES:
        record = fresh(type_[:2])
        controller = CONTROLLERS[type_](record, actor=SYSTEM)
        row = controller.create(f"a {type_} to work on", abstract="one line", brief="why it is here")
        for name in actions(CONTROLLERS[type_]):
            if name in WORLD:
                continue
            try:
                call(controller, name, row)
            except Refused:
                continue
            except Exception as e:
                broke.append(f"{type_} {name}: {type(e).__name__}: {e}")
    assert broke == [], "every action either does its work or refuses in words"


def test_every_action_is_reachable_as_a_command():
    features.load()
    from commands.cli import parser
    built = parser()._subparsers._group_actions[0].choices
    missing = [f"{type_} {controller.resource.names.get(name, name)}"
               for type_, controller in CONTROLLERS.items()
               for name in actions(type(controller(fresh(type_[:2]), actor=SYSTEM)))
               if controller.resource.names.get(name, name) not in built[type_]._subparsers._group_actions[0].choices]
    assert missing == [], "every public action on a controller is a journal command"
