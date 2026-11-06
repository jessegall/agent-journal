from dataclasses import replace
from datetime import timedelta

from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.doc_revision import DocRevision
from core.modules.documents.support.revision_change import RevisionChange
from core.modules.settings.bindings.support.setting_values import SettingValues

WINDOW_SETTING = "journal.core.documents.revision-minutes"
FIRST_CHANGE = "first version"


class DocRevisions:
    """Keeps a document's revisions: the first save is revision 1; a save by the same person while the latest
    revision is open folds into it; any other save with new text opens the next; a save with the same text
    keeps none."""

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def latest(self, doc_id: int) -> DocRevision | None:
        return self.queries.query(DocRevision).filter(doc_id=doc_id).descending("number").first()

    def record(self, doc: Doc, context: Context) -> None:
        latest, closes_at = self.latest(doc.id), Timestamp(context.timestamp.value + timedelta(minutes=self.settings.project.number(WINDOW_SETTING)))
        if latest is None:
            self.repository.save(DocRevision(doc_id=doc.id, creator_id=context.actor.id, number=1, title=doc.title, abstract=doc.abstract, body=doc.body,
                                             change=FIRST_CHANGE, closes_at=closes_at), context)
            return
        if (latest.title, latest.abstract, latest.body) == (doc.title, doc.abstract, doc.body):
            return
        change = RevisionChange.text(latest, doc)
        if latest.creator_id == context.actor.id and context.timestamp < latest.closes_at:
            notes = list(dict.fromkeys([*latest.change.split("; "), *change.split("; ")]))
            self.repository.save(replace(latest, title=doc.title, abstract=doc.abstract, body=doc.body, change="; ".join(notes), closes_at=closes_at), context)
            return
        self.repository.save(DocRevision(doc_id=doc.id, creator_id=context.actor.id, number=latest.number + 1, title=doc.title, abstract=doc.abstract, body=doc.body,
                                         change=change, closes_at=closes_at), context)

    # A save that must stand alone, such as a version from the team: it never folds into the latest revision, and it
    # closes at once, so the next edit opens its own.
    def record_standalone(self, doc: Doc, context: Context) -> None:
        latest = self.latest(doc.id)
        if latest is not None and (latest.title, latest.abstract, latest.body) == (doc.title, doc.abstract, doc.body):
            return
        number, change = (1, FIRST_CHANGE) if latest is None else (latest.number + 1, RevisionChange.text(latest, doc))
        self.repository.save(DocRevision(doc_id=doc.id, creator_id=context.actor.id, number=number, title=doc.title, abstract=doc.abstract, body=doc.body,
                                         change=change, closes_at=context.timestamp), context)
