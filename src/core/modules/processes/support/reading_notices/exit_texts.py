from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.processes.models.enums.reading_exit import ReadingExit


@dataclass(frozen=True)
class ExitText:
    """How an exit is said to an agent: the sentence and the command that takes it, when one does."""

    sentence: str
    command: str = ""


EXIT_TEXTS: dict[ReadingExit, ExitText] = {
    ReadingExit.COMPLY: ExitText("add or fix the reader", "journal reader add {name}"),
    ReadingExit.COUNT_TESTS: ExitText("save a reader that counts the tests for your reader request {name}, and the next run starts",
                                      "journal reader draft {name} --save, with --count and --count-command"),
    ReadingExit.SKIP_WITH_REASON: ExitText("skip this one start and say why", "journal refusal skip processes.reading --reason '<why>'"),
    ReadingExit.DECLARE_UNREADABLE: ExitText("mark the command unreadable", 'journal reader unreadable "{name}" --reason "<why>"'),
    ReadingExit.READ_OUTPUT: ExitText("read it", "journal output read {output}"),
    ReadingExit.STOP_RUN: ExitText("stop it", "journal output stop {output}"),
    ReadingExit.CLASSIFY: ExitText("say what type the command is", 'journal command-type make "{name}" "<type>"'),
    ReadingExit.EXPIRES: ExitText("wait until the block expires"),
    ReadingExit.PERSON_RELEASES: ExitText("a person releases it"),
    ReadingExit.MAIN_AGENT_HELPS: ExitText("ask the main agent for help"),
}


class ExitTexts:
    """The one table of how each exit from what the engine asks is said, so every refusal about reading states
    all of its exits in the same words."""

    @staticmethod
    def listed(exits: Sequence[ReadingExit], name: str, output: int) -> str:
        return "; ".join(ExitTexts.said(EXIT_TEXTS[way], name, output) for way in exits)

    @staticmethod
    def said(text: ExitText, name: str, output: int) -> str:
        sentence = text.sentence.format(name=name, output=output)
        return f"{sentence}: {text.command.format(name=name, output=output)}" if text.command else sentence

    @staticmethod
    def template(exits: Sequence[ReadingExit]) -> str:
        """The exits with their commands, the name and the output left as fields for a nudge declaration to fill, so
        a long line of exits is part of the declared text and never cut as a field."""
        return "; ".join(f"{EXIT_TEXTS[way].sentence}: {EXIT_TEXTS[way].command}" if EXIT_TEXTS[way].command else EXIT_TEXTS[way].sentence for way in exits)

    @staticmethod
    def sentences(exits: Sequence[ReadingExit]) -> str:
        """The exits said in their sentences alone, for a line too short to name their commands."""
        return "; ".join(EXIT_TEXTS[way].sentence for way in exits)
