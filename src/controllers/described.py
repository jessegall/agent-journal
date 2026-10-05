from controllers.base import actions
from controllers.types import CONTROLLERS
from resources.base import CLOSED, EVERY, OPEN, UPDATES
from resources.types import TYPES

SHOWN = {OPEN: "Open", EVERY: "All", UPDATES: "Updates", CLOSED: "Closed"}


def tabs(kind) -> list[dict]:
    return [{"key": key, "title": SHOWN[key], "shows": key} for key in kind.filters]


def described_types() -> dict[str, dict]:
    return {name: {"title": c.details.title, "abstract": c.details.abstract, "help": c.details.help, "view": c.view, "in_sidebar": c.in_sidebar, "listed_under": c.listed_under, "listed_as_cards": c.listed_as_cards, "created_in_viewer": c.created_in_viewer, "scope": c.scope, "icon": c.icon, "needs_attention": c.needs_attention, "lists_completed_unread": c.lists_completed_unread, "cleared_by": c.cleared_by, "filters": tabs(c), "nested": c.nested, "takes_comments": c.takes_comments, "closed_first": c.closed_first, "notified": list(c.notified), "typed_as_title": c.typed_as_title, "start_as_count": c.start_as_count, "fields": c.fields, "shown_fields": list(c.shown_fields), "fixed_fields": list(c.fixed_fields), "choices": c.choices, "labels": c.labels,
                         "command_names": dict(c.command_names), "event_labels": dict(c.event_labels), "methods": actions(CONTROLLERS[name])}
                  for name, c in TYPES.items()}
