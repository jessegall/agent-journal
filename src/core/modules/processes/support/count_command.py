import shlex

PART_MARK = "{part}"
QUOTED_PART_MARK = f'"{PART_MARK}"'


class CountCommand:
    """A reader's count command with the test part filled in: a part the command holds in double quotes is put in as one
    shell word whatever quotes or apostrophes it has, and any other part is put in as the line itself."""

    @staticmethod
    def filled(count_command: str, part: str) -> str:
        return count_command.replace(QUOTED_PART_MARK, shlex.quote(part)).replace(PART_MARK, part)
