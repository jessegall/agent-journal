import re
from collections.abc import Iterable

CLI_NAMES: dict[str, str] = {"document": "doc"}


class MentionRefs:
    """The rows a text names in words, such as task 12 or document 3, as each row's command name and number,
    once each, for the command names given."""

    @staticmethod
    def found(text: str, cli_names: Iterable[str]) -> tuple[tuple[str, int], ...]:
        candidate_names = sorted({*cli_names, *CLI_NAMES}, key=len, reverse=True)
        pattern = re.compile(rf"\b({'|'.join(re.escape(word) for word in candidate_names)})\s+(\d+)\b", re.IGNORECASE)
        refs: list[tuple[str, int]] = []
        for word, number in pattern.findall(text):
            lowered = str(word).lower()
            refs.append((CLI_NAMES[lowered] if lowered in CLI_NAMES else lowered, int(number)))
        return tuple(dict.fromkeys(refs))
