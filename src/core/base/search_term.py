SUFFIXES = ("ers", "er", "ing", "ly", "ed", "es", "s")
STEM_LENGTH_MINIMUM = 4


class SearchTerm:
    """A word a search looks for, lower case and cut to its stem, so hours finds two-hourly and reviews finds reviewer."""

    @staticmethod
    def stem(word: str) -> str:
        lowered = word.lower()
        suffix = next((ending for ending in SUFFIXES if lowered.endswith(ending) and len(lowered) - len(ending) >= STEM_LENGTH_MINIMUM), "")
        return lowered[:len(lowered) - len(suffix)]
