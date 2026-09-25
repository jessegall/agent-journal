from typing import ClassVar

from resources.base import COMMISSIONED, FINISHED, PAUSED, PROJECT, RESUMED, Resource, ResourceDetails, STARTED, USER, WIDE
from resources.shapes import FLAG, LIST, NUMBER, TEXT, Field, Shape

START, REVIEW, DONE = "start", "review", "done"
MEANINGS = (START, REVIEW, DONE)


class Board(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Board",
        abstract="A named board of tickets with stages of its own",
        help="A board holds tickets in stages the user names. A stage can be marked as where work starts, where it waits for "
             "review, or where it is done; the journal acts on a stage only once it is marked.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(LIST, list, name="stages"),
        Field(default=dict, name="meanings"),
        Field(NUMBER, 0, name="expected"),
        Field(default=dict, name="drafting"),
        Field(default=dict, name="building"),
        Field(default=dict, name="added"),
        Field(TEXT, "", name="branch"),
        Field(TEXT, "", name="goal"),
        Field(LIST, list, name="done_when"),
        Field(NUMBER, 0.0, name="started"),
        Field(NUMBER, 0.0, name="paused"),
        Field(NUMBER, 0.0, name="finished"),
        Field(FLAG, False, name="orchestrator_approves_plans"),
        Field(FLAG, False, name="orchestrator_accepts_waits"),
        Field(FLAG, False, name="orchestrator_confirms_drafts"),
        Field(TEXT, "orchestrator", name="plan_reviewer"),
    ]
    type = "board"
    icon = "board"
    scope = PROJECT
    view = WIDE
    in_sidebar = False
    moments = ("created", "completed", COMMISSIONED, STARTED, PAUSED, RESUMED, FINISHED)
    created_in_viewer = True
    notified = (USER,)
    labels = {"brief": "What it is for", "outcome": "Why closed", "stages": "Stages", "meanings": "What the stages mean",
              "branch": "Branch its tickets land on", "orchestrator_approves_plans": "The orchestrating agent approves ticket plans",
              "orchestrator_accepts_waits": "The orchestrating agent accepts or declines the waits agents propose between tickets",
              "orchestrator_confirms_drafts": "The orchestrating agent confirms drafted tickets",
              "plan_reviewer": "Who reviews a ticket's plan: orchestrator, or subagent"}
    shown_fields = ("stages", "branch", "orchestrator_approves_plans", "orchestrator_accepts_waits", "orchestrator_confirms_drafts", "plan_reviewer")
