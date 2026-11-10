import re

from engine.errors.refusal import Refusal

TITLE_RULE = "a short whole phrase in plain words that says what the run is doing, such as Running tests or Building the viewer"
PHRASE_ENDINGS_REFUSED = frozenset({"of", "the", "a", "an", "to", "for", "with", "and", "or", "in", "on", "at", "by", "from", "into", "over"})
ACTIVITY_ENDING = "ing"
FLAG_PATH_PATTERN = re.compile(r"(^|\s)(--?[a-z]|\.{0,2}/)|/[a-z]")


class TitlePhrase:
    """A run's title says what the run is doing, as a whole phrase that opens on an activity and never stops
    on a connecting word."""

    @staticmethod
    def checked(text: str) -> str:
        terms = text.split()
        if len(terms) < 2:
            raise Refusal(f"a run's title is {TITLE_RULE}, not the single word {text!r}", "say what runs")
        if not terms[0].lower().endswith(ACTIVITY_ENDING):
            raise Refusal(f"a run's title is {TITLE_RULE}, not {text!r}", "open it on what it does")
        if terms[-1].lower() in PHRASE_ENDINGS_REFUSED:
            raise Refusal(f"a run's title is {TITLE_RULE}, not {text!r}, which stops on {terms[-1]!r}", "write the phrase whole")
        if FLAG_PATH_PATTERN.search(text):
            raise Refusal(f"a run's title is {TITLE_RULE}, not {text!r}, which contains a flag or a path", "say it in words")
        return text
