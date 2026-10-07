from typing import ClassVar

from features.form_of_address.voices import HELPER, HELPERS
from resources.base import DOCUMENT, PROJECT, Resource, ResourceDetails
from resources.shapes import FLAG, Field, Shape


class Profile(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="calling"),
        Field(default="", name="sample"),
        Field(default=HELPER, name="helper"),
        Field(default=HELPERS, name="helpers"),
        Field(FLAG, False, name="system"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Profile",
        abstract="How the agent talks to you: its voice, what it calls you and a sample line",
        help=("A profile's brief is its voice in plain words: the tone, the humour, how it uses your name and when it reacts. "
              "--set calling=\"title and name\", name or none says what it calls you; --set sample=\"<line>\" is how it answers "
              "the sample question, shown when you choose; --set helper=<word> --set helpers=<word> is what it calls your helpers and subagents, one and many. The four that ship with the journal cannot be changed or removed: "
              "journal profile duplicate <n> makes one you can."),
    )
    type = "profile"
    event_labels = {"created": "Profile written", "updated": "Profile changed", "completed": "Profile closed"}
    labels = {"brief": "How it talks"}
    icon = "docs"
    command_names = {"complete": "retire"}
    scope = PROJECT
    view = DOCUMENT
