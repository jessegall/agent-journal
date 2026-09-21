from resources.base import DOCUMENT, Resource
from resources.shapes import Field, Shape, names

PHASE = names("title", "when", "checkpoint", "brief", "todos")


class Plan(Shape, Resource):
    type = "plan"
    notify_actions = ("updated",)
    shown = {"created": "Plan drafted", "completed": "Plan acknowledged"}
    says = {"complete": "acknowledging"}
    status = Field()
    stage = Field()
    phases = Field(default=list)
    current = Field(default=1)
    handed = "PLANS running"
    attention = True
    finished_is_news = True
    icon = "flag"
    names = {"complete": "acknowledge", "place": "todos", "resume": "continue"}
    title_ = "Plan"
    abstract_ = "Ordered phases of to-dos with a goal, approved by the user before it runs"
    help_ = "A plan is drafted by the agent, approved and continued by the user, and worked phase by phase. While it is being written the agent says which stage it is at with journal plan stage <n> phases|todos, so the viewer knows whether the phases or the rows under them are still to come. journal plan build takes a plan that is ready back to being written, for when there is more to add."
    view = DOCUMENT
