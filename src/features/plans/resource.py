from typing import ClassVar

from resources.base import DOCUMENT, SIDEBAR, Resource, ResourceDetails
from resources.shapes import Field, Shape, names

PHASE = names("title", "when", "checkpoint", "brief", "todos")


class Plan(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(name="status"),
        Field(name="stage"),
        Field(default=list, name="phases"),
        Field(default=1, name="current"),
        Field(default="normal", name="depth"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Plan",
        abstract="Ordered phases of to-dos with a goal, approved by the user before it runs",
        help="A plan is drafted by the agent, approved and continued by the user, and worked phase by phase. While it is being written the agent says which stage it is at with journal plan stage <n> phases|todos, so the viewer knows whether the phases or the rows under them are still to come. journal plan build takes a plan that is ready back to being written, for when there is more to add.",
    )
    listed_open = True
    type = "plan"
    notify_actions = ("updated",)
    event_labels = {"created": "Plan started", "completed": "Plan finished"}
    labels = {"abstract": "One line: what is true when it is done", "brief": "What you want, in your own words; the agent builds the plan with you from here"}
    status_labels = {"complete": "finishing"}
    start_heading = "PLANS running"
    needs_attention = True
    lists_completed_unread = True
    icon = "flag"
    listed_under = SIDEBAR
    command_names = {"complete": "finish", "place": "todos", "resume": "continue"}
    view = DOCUMENT
