from core.base.refusal import Refusal

ABSTRACT_LIMIT_CHARACTERS = 200
TITLE_LIMIT_CHARACTERS = 200


class AbstractCheck:
    """The rules a document's or report's title and abstract keep: a title, and an abstract of one short description."""

    @staticmethod
    def check(title: str, abstract: str) -> None:
        if not 1 <= len(title) <= TITLE_LIMIT_CHARACTERS:
            raise Refusal(f"a title is 1 to {TITLE_LIMIT_CHARACTERS} characters, not {len(title)}", "say it shorter")
        if not abstract.strip():
            raise Refusal("an abstract is required: one short description of the text", 'give it with --abstract "<one line>"')
        if len(abstract) > ABSTRACT_LIMIT_CHARACTERS:
            raise Refusal(f"the abstract is {len(abstract)} characters, longer than {ABSTRACT_LIMIT_CHARACTERS}", "say it in one short description")
