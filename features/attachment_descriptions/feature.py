from features.attachment_descriptions.details import AttachmentsDetails
from features.attachment_descriptions.handlers import SampleVideoFrames, TagMissingAtStart, TagNewMedia
from features.base import Feature
from features.journal import Journal


class Attachments(Feature):
    details = AttachmentsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TagNewMedia())
        journal.events.handler(TagMissingAtStart())
        journal.events.handler(SampleVideoFrames())
