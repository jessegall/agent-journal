from typing import ClassVar

from resources.base import PROJECT, USER, Resource, ResourceDetails
from resources.shapes import LIST, TEXT, Field, Shape

MESSAGE, NUDGE, INSTRUCT, DENY = "message", "nudge", "instruct", "deny"
DOES = (MESSAGE, NUDGE, INSTRUCT, DENY)


class Trigger(Shape, Resource):
    type = "trigger"
    icon = "flag"
    scope = PROJECT
    created_in_viewer = True
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Trigger",
        abstract="Words the user watches for, and what the journal does when they come up",
        help="A trigger fires when one of its words appears in what the agent writes or runs, or in what the user writes to it. It then sends a message, nudges the agent, instructs it, or denies the call outright.",
    )
    command_names = {"complete": "retire"}
    notified = (USER,)
    data_fields: ClassVar[list[Field]] = [
        Field(LIST, list, name="words", required=True),
        Field(TEXT, "both", name="words_in"),
        Field(TEXT, NUDGE, name="does"),
        Field(TEXT, name="text"),
    ]
    labels = {"brief": "What it says", "outcome": "Why retired"}
