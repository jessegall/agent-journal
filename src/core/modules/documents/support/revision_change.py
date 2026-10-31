from core.modules.documents.models.doc import Doc
from core.modules.documents.models.doc_revision import DocRevision
from core.modules.documents.support.outline import Outline

TOP_CHANGE = "reworded the top"


class RevisionChange:
    """What an edit changed in a document, section by section: the top first, then the sections added,
    rewritten and cut."""

    @staticmethod
    def text(previous: DocRevision, current: Doc) -> str:
        previous_sections, current_sections = Outline.built(previous.body).sections, Outline.built(current.body).sections
        previous_text = {section.heading: section.lines for section in previous_sections if section.number}
        current_text = {section.heading: section.lines for section in current_sections if section.number}
        previous_top = [section.lines for section in previous_sections if not section.number]
        current_top = [section.lines for section in current_sections if not section.number]
        notes = [TOP_CHANGE] if (previous.title, previous.abstract, previous_top) != (current.title, current.abstract, current_top) else []
        notes += [f"added {heading}" for heading in current_text if heading not in previous_text]
        notes += [f"rewrote {heading}" for heading in current_text if heading in previous_text and previous_text[heading] != current_text[heading]]
        notes += [f"cut {heading}" for heading in previous_text if heading not in current_text]
        return "; ".join(notes)
