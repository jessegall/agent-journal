from engine.event.created import Created
from engine.event.updated import Updated
from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.plans.models.phase import Phase


class PhaseMentionListener(TextMentionListener[Created[Phase] | Updated[Phase]]):
    """Links a phase to the rows named in its title and goal."""

    name = "documents.phase-mentions"
    text_fields = ("title", "goal")
