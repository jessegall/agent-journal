import inspect
from functools import cache

from controllers.base import actions, word_names, word_parameters
from controllers.types import CONTROLLERS
from resources.base import CLOSED, EVERY, OPEN, UPDATES
from resources.types import TYPES

SHOWN = {OPEN: "Open", EVERY: "All", UPDATES: "Updates", CLOSED: "Closed"}
SPELLED = (inspect.Parameter.POSITIONAL_OR_KEYWORD, inspect.Parameter.KEYWORD_ONLY)


def tabs(kind) -> list[dict]:
    return [{"key": key, "title": SHOWN[key], "shows": key} for key in kind.filters]


@cache
def row_actions(controller: type) -> dict[str, dict[str, bool]]:
    named = controller.resource.command_names
    taking = {name: word_parameters(controller, name) for name in sorted(word_names(controller))}
    return {named.get(name, name): {p.name: p.default is inspect.Parameter.empty for p in parameters[1:] if p.kind in SPELLED}
            for name, parameters in taking.items() if parameters and parameters[0].name == "n"}


def described_types() -> dict[str, dict]:
    return {name: {"title": c.details.title, "abstract": c.details.abstract, "help": c.details.help, "view": c.view, "in_sidebar": c.in_sidebar, "listed_under": c.listed_under, "listed_as_cards": c.listed_as_cards, "created_in_viewer": c.created_in_viewer, "scope": c.scope, "icon": c.icon, "needs_attention": c.needs_attention, "lists_completed_unread": c.lists_completed_unread, "cleared_by": c.cleared_by, "filters": tabs(c), "nested": c.nested, "takes_comments": c.takes_comments, "closed_first": c.closed_first, "notified": list(c.notified), "typed_as_title": c.typed_as_title, "start_as_count": c.start_as_count, "fields": c.fields, "shown_fields": list(c.shown_fields), "fixed_fields": list(c.fixed_fields), "choices": c.choices, "labels": c.labels, "moments": list(c.moments),
                         "command_names": dict(c.command_names), "event_labels": dict(c.event_labels), "methods": actions(CONTROLLERS[name]), "row_actions": row_actions(CONTROLLERS[name])}
                  for name, c in TYPES.items()}
