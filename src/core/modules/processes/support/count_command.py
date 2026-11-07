import shlex

PART_MARK = "{part}"
QUOTED_PART_MARK = f'"{PART_MARK}"'


class CountCommand:
    """Fills a reader's count command with a test part, quoting it when the placeholder is quoted."""

    @staticmethod
    def filled(count_command: str, part: str) -> str:
        return count_command.replace(QUOTED_PART_MARK, shlex.quote(part)).replace(PART_MARK, part)
