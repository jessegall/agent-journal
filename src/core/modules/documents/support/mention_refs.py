import re
from collections.abc import Iterable

CLI_NAMES: dict[str, str] = {"document": "doc"}


class MentionRefs:
    """The rows a text names, such as task 12, document 3 or message:7, as each row's command name and number,
    once each, for the command names given."""

    @staticmethod
    def found(text: str, cli_names: Iterable[str]) -> tuple[tuple[str, int], ...]:
        candidate_names = sorted({*cli_names, *CLI_NAMES}, key=len, reverse=True)
        pattern = re.compile(rf"(?<![\w-])({'|'.join(re.escape(word) for word in candidate_names)})(?:\s+|:)([0-9]+)(?![\w-]|\.[0-9])", re.IGNORECASE)
        refs: list[tuple[str, int]] = []
        for match in pattern.finditer(text):
            word, number = match.groups()
            significant = number.lstrip("0")
            if not significant or len(significant) > 19 or (len(significant) == 19 and significant > "9223372036854775807"):
                continue
            lowered = str(word).lower()
            refs.append((CLI_NAMES[lowered] if lowered in CLI_NAMES else lowered, int(significant)))
        return tuple(dict.fromkeys(refs))
