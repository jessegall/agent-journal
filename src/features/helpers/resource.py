from typing import ClassVar

from resources.base import UNLISTED, Resource, ResourceDetails
from resources.shapes import Field, Shape
from resources.types import HELPER


class Helper(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Helper",
        abstract="An agent on any provider dispatched for one bounded job, in an environment of its own that stays out of the lists",
        help="journal helper dispatch <name> \"<job>\" --provider codex --model <model> --brief \"<the job>\" [--worktree] starts one; say sends it a follow-up, report is how it answers, stop ends its agent and finish packs it away.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="name"),
        Field(default="", name="provider"),
        Field(default="", name="model"),
        Field(default="", name="environment"),
        Field(default="", name="worktree"),
        Field(default="", name="report"),
        Field(default=False, name="stopped_by_user"),
    ]
    type = HELPER
    icon = "bot"
    listed_under = UNLISTED
    in_sidebar = False
    created_in_viewer = False
    subagent_writable = False
    takes_comments = False
    command_names = {"complete": "finish"}
