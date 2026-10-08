from typing import ClassVar

from resources.base import DOCUMENT, PROJECT, Resource, ResourceDetails
from resources.shapes import FLAG, Field, Shape


class Profile(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="calling"),
        Field(default="", name="sample"),
        Field(default="", name="humour"),
        Field(default="", name="naming"),
        Field(FLAG, False, name="system"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Profile",
        abstract="How the agent talks to you: its voice, what it calls you and a sample line",
        help=("A profile's brief is its voice in plain words: the tone, the humour, how it uses your name and when it reacts. "
              "--set calling=\"title and name\", name or none says what it calls you; --set humour=\"<how>\" is how it answers a "
              "meme, a joke, criticism or anger; --set naming=\"<how>\" is how it names the helpers and subagents it starts; "
              "--set sample=\"<line>\" is how it answers the sample question, shown when you choose. The four that ship with the journal "
              "cannot be changed or removed: "
              "journal profile duplicate <n> makes one you can."),
    )
    type = "profile"
    event_labels = {"created": "Profile written", "updated": "Profile changed", "completed": "Profile closed"}
    labels = {"brief": "How it talks"}
    icon = "docs"
    command_names = {"complete": "retire"}
    scope = PROJECT
    view = DOCUMENT
