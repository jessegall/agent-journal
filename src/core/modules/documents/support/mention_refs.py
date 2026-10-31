import re

MENTION = re.compile(r"\b(task|plan|message|doc|document|report|question)\s+(\d+)\b", re.IGNORECASE)
CLI_NAMES: dict[str, str] = {"document": "doc"}


class MentionRefs:
    """The rows a text names in words, such as task 12 or document 3, as each row's command name and number,
    once each."""

    @staticmethod
    def found(text: str) -> tuple[tuple[str, int], ...]:
        refs: list[tuple[str, int]] = []
        for word, number in MENTION.findall(text):
            lowered = str(word).lower()
            refs.append((CLI_NAMES[lowered] if lowered in CLI_NAMES else lowered, int(number)))
        return tuple(dict.fromkeys(refs))
