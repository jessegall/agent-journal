from typing import ClassVar

from resources.base import PROJECT, SIDEBAR, USER, Resource, ResourceDetails
from resources.shapes import FLAG, LIST, NUMBER, TEXT, Field, Shape

MESSAGE, NUDGE, INSTRUCT, DENY, START = "message", "nudge", "instruct", "deny", "start"
DOES = (MESSAGE, NUDGE, INSTRUCT, DENY, START)
FIRED = "fired"
FROM_USER = "user"


class Trigger(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Trigger",
        abstract="Words the user watches for, and what the journal does when they come up",
        help="A trigger fires when one of its words appears in what the agent writes or runs, or in what the user writes to it. It then sends a message, nudges the agent, instructs it, or denies the call outright.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(LIST, list, name="words", required=True),
        Field(TEXT, "both", name="words_in"),
        Field(TEXT, NUDGE, name="does"),
        Field(TEXT, name="text"),
        Field(FLAG, False, name="system"),
        Field(NUMBER, 0, name="matched"),
        Field(NUMBER, 0, name="matched_at"),
    ]
    type = "trigger"
    icon = "bolt"
    scope = PROJECT
    listed_under = SIDEBAR
    created_in_viewer = True
    command_names = {"complete": "retire"}
    notified = (USER,)
    labels = {"brief": "What it says", "outcome": "Why retired", "words": "Words", "words_in": "Where they count", "does": "What it does", "text": "What it sends"}
    shown_fields = ("words", "words_in", "does", "text")
    choices = {"does": list(DOES), "words_in": ["text", "commands", "both", "everything", FROM_USER]}

    @property
    def wording(self) -> str:
        return self.text or self.brief
