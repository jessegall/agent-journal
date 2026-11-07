import shlex
from dataclasses import dataclass
from pathlib import Path

from core.modules.processes.support.background_commands import JOURNAL
from core.base.driver.part import Part
from core.modules.processes.models.process_part import ProcessPart

FLAG = "--ask-main"
FLAG_WITH_VALUE = f"{FLAG}="
JOURNAL_READ_FLAGS = ("--tail", "--head", "--cut")


@dataclass(frozen=True)
class WorkerTestFlag:
    """The --ask-main flag of a test part: whether it is there, its reason, and the command with the flag removed,
    written one way so that spacing and quoting do not matter when two commands are compared."""

    is_flagged: bool
    reason: str
    command: str

    @classmethod
    def parsed(cls, part: Part) -> "WorkerTestFlag":
        return cls.arguments_flag(part.text, part.program, part.arguments)

    @classmethod
    def run_part_flag(cls, part: ProcessPart) -> "WorkerTestFlag":
        tokens = shlex.split(part.text)
        position = next((number for number, token in enumerate(tokens) if Path(token).name == part.program), -1)
        return cls.arguments_flag(part.text, part.program, tuple(tokens[position + 1:]))

    @classmethod
    def arguments_flag(cls, text: str, program: str, arguments: tuple[str, ...]) -> "WorkerTestFlag":
        is_flagged, reason, kept = False, "", []
        remaining = iter(arguments)
        for word in remaining:
            if word == FLAG:
                is_flagged, reason, kept = True, *cls.reason_after_flag(next(remaining, ""), kept)
            elif word.startswith(FLAG_WITH_VALUE):
                is_flagged, reason = True, word.removeprefix(FLAG_WITH_VALUE)
            elif program == JOURNAL and word in JOURNAL_READ_FLAGS:
                next(remaining, "")
            else:
                kept.append(word)
        return cls(is_flagged, reason.strip(), shlex.join([cls.program_text(text, program), *kept]))

    @staticmethod
    def reason_after_flag(word: str, kept: list[str]) -> tuple[str, list[str]]:
        return ("", [*kept, word]) if word.startswith("-") else (word, kept)

    @staticmethod
    def program_text(text: str, program: str) -> str:
        try:
            return next((word for word in shlex.split(text) if Path(word).name == program), program)
        except ValueError:
            return program
