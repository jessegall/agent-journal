import shlex
from dataclasses import dataclass
from pathlib import Path

from core.base.driver.part import Part

FLAG = "--ask-main"
FLAG_WITH_VALUE = f"{FLAG}="
JOURNAL = "journal"
JOURNAL_READING_FLAGS = ("--tail", "--head", "--cut")


@dataclass(frozen=True)
class WorkerTestFlag:
    """The --ask-main flag of a test part: whether it is there, its reason, and the command with the flag removed,
    written one way so that spacing and quoting do not matter when two commands are compared."""

    is_flagged: bool
    reason: str
    command: str

    @classmethod
    def of(cls, part: Part) -> "WorkerTestFlag":
        is_flagged, reason, kept = False, "", []
        words = iter(part.arguments)
        for word in words:
            if word == FLAG:
                is_flagged, reason, kept = True, *cls.reason_after_flag(next(words, ""), kept)
            elif word.startswith(FLAG_WITH_VALUE):
                is_flagged, reason = True, word.removeprefix(FLAG_WITH_VALUE)
            elif part.program == JOURNAL and word in JOURNAL_READING_FLAGS:
                next(words, "")
            else:
                kept.append(word)
        return cls(is_flagged, reason.strip(), shlex.join([cls.program_as_written(part), *kept]))

    @staticmethod
    def reason_after_flag(word: str, kept: list[str]) -> tuple[str, list[str]]:
        return ("", [*kept, word]) if word.startswith("-") else (word, kept)

    @staticmethod
    def program_as_written(part: Part) -> str:
        try:
            return next((word for word in shlex.split(part.text) if Path(word).name == part.program), part.program)
        except ValueError:
            return part.program
