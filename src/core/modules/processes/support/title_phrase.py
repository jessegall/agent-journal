from core.base.refusal import Refusal

TITLE_RULE = "a short whole phrase in plain words that says what the run is doing, such as Running tests or Building the viewer"
PHRASE_ENDINGS_REFUSED = frozenset({"of", "the", "a", "an", "to", "for", "with", "and", "or", "in", "on", "at", "by", "from", "into", "over"})
ACTIVITY_ENDING = "ing"


class TitlePhrase:
    """A run's title says what the run is doing, as a whole phrase that opens on an activity and never stops on a connecting word."""

    @staticmethod
    def checked(text: str) -> str:
        words = text.split()
        if len(words) < 2:
            raise Refusal(f"a run's title is {TITLE_RULE}, not the single word {text!r}", "say what runs")
        if not words[0].lower().endswith(ACTIVITY_ENDING):
            raise Refusal(f"a run's title is {TITLE_RULE}, not {text!r}", "open it on what it does")
        if words[-1].lower() in PHRASE_ENDINGS_REFUSED:
            raise Refusal(f"a run's title is {TITLE_RULE}, not {text!r}, which stops on {words[-1]!r}", "write the phrase whole")
        return text
