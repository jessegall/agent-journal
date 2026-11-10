from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.plans.models.plan import Plan
from engine.change.created import Created
from engine.change.updated import Updated


class PlanMentionListener(TextMentionListener[Created[Plan] | Updated[Plan]]):
    """Links a saved plan to the rows it names."""

    text_fields = ("title", "brief")
    name = "documents.plan-mentions"
