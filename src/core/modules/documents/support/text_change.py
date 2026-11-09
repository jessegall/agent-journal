from dataclasses import dataclass

from core.base.refusal import Refusal
from core.modules.documents.support.outline import Outline


@dataclass(frozen=True)
class TextChange:
    """What an edit changes in a text: all of it, the lines of one section, or one exact piece of it."""

    body: str | None = None
    section: str | None = None
    old_text: str | None = None
    new_text: str = ""

    def changes_body(self) -> bool:
        return self.body is not None or self.old_text is not None

    def applied(self, text: str) -> str:
        if self.old_text is not None:
            return self.with_text_replaced(text, self.old_text, self.new_text)
        if self.body is None:
            return text
        return self.body if self.section is None else self.with_section_replaced(text, self.section, self.body)

    @staticmethod
    def with_text_replaced(text: str, old_text: str, new_text: str) -> str:
        count = text.count(old_text)
        if count != 1:
            raise Refusal(f"the text to replace is there {count} times, not once", "give more of the text around it, so it is there exactly once")
        return text.replace(old_text, new_text)

    @staticmethod
    def with_section_replaced(text: str, wanted: str, body: str) -> str:
        outline = Outline.built(text)
        matching = outline.matching(wanted)
        if not matching:
            raise Refusal(f"no section {wanted}: the outline numbers them from 1", "the outline lists them with their numbers")
        target, *others = matching
        if others:
            raise Refusal(f"{len(matching)} sections are headed {wanted}", "name the section by its number")
        return outline.with_section_text(target, body)
