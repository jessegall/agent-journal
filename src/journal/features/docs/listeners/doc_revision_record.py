from journal.engine.clock import Clock
from journal.events.listener import Listener
from journal.events.models.saved import Saved
from journal.models.doc import Doc
from journal.models.doc_revision import FIRST_NOTE, DocRevision
from journal.repositories.doc_revisions import DocRevisions
from journal.repositories.setting_rows import SettingRows


class DocRevisionRecord(Listener[Saved]):
    """Every save of a document that changes its text is kept as a revision: the first save writes revision 1, a later one within the open window folds into the open revision with its change noted, and one after it opens the next."""

    def __init__(self, revisions: DocRevisions, settings: SettingRows, clock: Clock) -> None:
        self.revisions, self.settings, self.clock = revisions, settings, clock

    def handle(self, event: Saved) -> None:
        if isinstance(event.model, Doc):
            self.recorded(event.model, event)

    def recorded(self, doc: Doc, event: Saved) -> None:
        from journal.features.docs.feature import DocsFeature
        time = self.clock.time()
        closes_at = time + float(self.settings.option(DocsFeature.REVISION_WINDOW)) * 60
        latest = self.revisions.latest(doc)
        if latest is None:
            self.revisions.added(DocRevision.build(doc, 1, FIRST_NOTE, closes_at), doc, event.actor)
            return
        change = latest.difference(doc)
        if not change:
            return
        if latest.is_open(time):
            self.revisions.save(latest.folded(doc, change, closes_at), event.actor)
            return
        self.revisions.added(DocRevision.build(doc, latest.number + 1, change, closes_at), doc, event.actor)
