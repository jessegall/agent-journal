from journal.support.rejection import Rejection

ACTIVITY_SUFFIX = "ing"


class ActivityTitle:
    """A card's title says what the run is doing, Running the tests or Building the application, opening on a word of activity, never a bare name such as Tests."""

    @staticmethod
    def checked(text: str) -> str:
        title_parts = text.split()
        if title_parts and not title_parts[0].lower().endswith(ACTIVITY_SUFFIX):
            raise Rejection(f"a card's title says what the run is doing, such as Running the tests or Building the application, not {text!r}: open it on what it does")
        return text
