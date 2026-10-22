import re

OUTPUT = re.compile(r"outputs/[\w.-]+|(?<=journal output read )\d+")
FULL_READ_PATTERN = re.compile(r"\s*journal output read \d+\s*")


class OutputReads:
    """A shell line that reads an output by hand, and its shape with the output's number taken out, so two reads of the same kind look alike."""

    @staticmethod
    def is_one(command: str) -> bool:
        return bool(OUTPUT.search(command)) and "--reader" not in command and not FULL_READ_PATTERN.fullmatch(command)

    @staticmethod
    def shape(command: str) -> str:
        return OUTPUT.sub("<output>", command)
