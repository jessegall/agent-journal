from journal.features.feature import Feature
from journal.features.mentions.listeners.link_mentions import LinkMentions


class MentionsFeature(Feature):
    name = "mentions"
    title = "Linked mentions"
    help = "A row whose text names another, such as task 12 or report 3, is linked to it, so each row shows where it was spoken of."
    listeners = (LinkMentions,)
