from typing import ClassVar

from resources.base import PROJECT, USER, Resource, ResourceDetails
from resources.shapes import FLAG, NUMBER, TEXT, Field, Placed, Shape

AGENT_CLI = "claude"


class Ticket(Placed, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Ticket",
        abstract="A piece of work on a board, from the user, an agent or an outside source, run in an environment of its own",
        help="A ticket is the anchor for one piece of work: where it came from, which board and stage it sits in, who owns it, "
             "and the environment and plan it runs in once started. A ticket from an outside source carries that source's id, "
             "so the same event arriving again updates its ticket instead of making another.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(NUMBER, 0, name="board"),
        Field(TEXT, name="stage"),
        Field(TEXT, name="source"),
        Field(TEXT, name="source_id"),
        Field(TEXT, name="owner"),
        Field(TEXT, name="work_environment"),
        Field(TEXT, "", name="base"),
        Field(default=dict, name="bases"),
        Field(TEXT, AGENT_CLI, name="agent"),
        Field(NUMBER, 0.0, name="launched"),
        Field(NUMBER, 0.0, name="queued_at"),
        Field(NUMBER, 0, name="plan"),
        Field(FLAG, False, name="queued"),
        Field(FLAG, False, name="draft"),
        Field(NUMBER, 100, name="priority"),
        Field(default=dict, name="dependencies"),
        Field(default=list, name="declined"),
        Field(FLAG, False, name="hosted"),
        Field(NUMBER, 0.0, name="idle_since"),
        Field(FLAG, False, name="halted"),
        Field(NUMBER, 0, name="restarts"),
    ]
    type = "ticket"
    icon = "ticket"
    scope = PROJECT
    created_in_viewer = True
    listed_open = True
    notified = (USER,)
    labels = {"brief": "What is wanted", "outcome": "How it ended", "board": "Board", "stage": "Stage", "source": "Source",
              "source_id": "Id at the source", "owner": "Owner", "work_environment": "Works in", "plan": "Plan"}
    shown_fields = ("board", "stage", "source", "owner", "work_environment", "plan")
