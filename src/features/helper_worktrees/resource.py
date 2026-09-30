from typing import ClassVar

from resources.base import PROJECT, UNLISTED, Resource, ResourceDetails
from resources.shapes import Field, Shape


class Worktree(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Worktree",
        abstract="A git worktree handed to a helper, cut from the tip of the branch the project is working on",
        help="journal worktree cut <name> makes one from the working branch's current tip; drift says what that branch gained since, take cherry-picks the helper's commits onto it once the helper has rebased, and drop removes the worktree and its branch.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="path"),
        Field(default="", name="branch"),
        Field(default="", name="working"),
        Field(default="", name="base"),
        Field(default="", name="helper"),
        Field(default="", name="told"),
        Field(default="", name="taken"),
    ]
    type = "worktree"
    icon = "branch"
    scope = PROJECT
    listed_under = UNLISTED
    in_sidebar = False
    created_in_viewer = False
    subagent_writable = False
    takes_comments = False
    command_names = {"complete": "drop"}
