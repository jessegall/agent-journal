from typing import ClassVar

from resources.base import PROJECT, SIDEBAR, USER, Resource, ResourceDetails
from resources.shapes import FLAG, LIST, NUMBER, TEXT, Field, Shape

MESSAGE, NUDGE, INSTRUCT, DENY, START, HOLD = "message", "nudge", "instruct", "deny", "start", "hold"
DOES = (MESSAGE, NUDGE, INSTRUCT, DENY, START, HOLD)
WORDS, STATE = "words", "state"
WHEN = (WORDS, STATE)
STATE_DOES = (NUDGE, INSTRUCT, HOLD)
ANY, IDLE, WORKING = "any", "idle", "working"
ONLY_WHEN = (ANY, IDLE, WORKING)
FIRED = "fired"
FROM_USER = "user"


class Trigger(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Trigger",
        abstract="Words, or a fact in the journal, that the user watches for, and what the journal does when they come up",
        help="A trigger fires when one of its words appears in what the agent writes or runs, or in what the user writes to it, or when a fact about the journal is true, such as a message left unanswered. It then sends a message, nudges the agent, instructs it, holds its writes, or denies the call outright.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, WORDS, name="when"),
        Field(LIST, list, name="words", required=True),
        Field(TEXT, "both", name="words_in"),
        Field(TEXT, NUDGE, name="does"),
        Field(TEXT, name="text"),
        Field(TEXT, name="fact"),
        Field(NUMBER, 0, name="over"),
        Field(TEXT, ANY, name="only_when"),
        Field(NUMBER, 0, name="timing"),
        Field(NUMBER, 3, name="most"),
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
    labels = {"brief": "What it says", "outcome": "Why retired", "words": "Words", "words_in": "Where they count", "does": "What it does", "text": "What it sends",
              "when": "What it watches", "fact": "What is true", "over": "Past how much", "only_when": "While the agent is", "timing": "Repeats every (minutes)", "most": "Most times for each"}
    shown_fields = ("when", "words", "words_in", "fact", "over", "only_when", "does", "text", "timing", "most")
    choices = {"when": list(WHEN), "only_when": list(ONLY_WHEN), "does": list(DOES), "words_in": ["text", "commands", "both", "everything", FROM_USER]}

    @classmethod
    def unfilled(cls, data: dict) -> list[str]:
        needed = ["fact"] if data.get("when") == STATE else cls.required
        return [name for name in needed if not data.get(name)]

    @property
    def is_state(self) -> bool:
        return self.when == STATE

    @property
    def wording(self) -> str:
        return self.text or self.brief
