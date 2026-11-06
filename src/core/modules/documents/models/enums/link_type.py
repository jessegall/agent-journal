from enum import StrEnum


class LinkType(StrEnum):
    """What a link between two rows means: the row a report is about, a row a text names, or a comment on a
    row, or the agent a message also went to."""

    SUBJECT = "about"
    MENTION = "mentions"
    COMMENT = "comments_on"
    RECIPIENT = "sent_to"
    EDITED = "edited"
    REFERENCE = "refers_to"
