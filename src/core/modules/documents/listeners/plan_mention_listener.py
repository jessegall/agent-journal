from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.plans.models.plan import Plan


class PlanMentionListener(TextMentionListener):
    """Links a saved plan to the rows it names."""

    model = Plan
    text_fields = ("title", "brief")
    name = "documents.plan-mentions"
    event = "plan.create|plan.update"
