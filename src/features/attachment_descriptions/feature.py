from features.attachment_descriptions.details import AttachmentDescriptionsDetails
from features.attachment_descriptions.handlers import SampleVideoFrames, TagMissingAtStart, TagNewMedia
from features.base import Feature
from features.journal import Journal


class AttachmentDescriptions(Feature):
    details = AttachmentDescriptionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TagNewMedia())
        journal.events.handler(TagMissingAtStart())
        journal.events.handler(SampleVideoFrames())
