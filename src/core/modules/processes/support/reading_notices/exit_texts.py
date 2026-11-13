from collections.abc import Sequence

from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.support.reading_notices.exit_text import ExitText


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
    ReadingExit.PERSON_RELEASES: ExitText("a user releases it"),
    ReadingExit.MAIN_AGENT_HELPS: ExitText("ask the main agent for help"),
}


class ExitTexts:
    """The one table of how each exit from what the engine asks is said, so every refusal about reading states
    all of its exits in the same words."""

    @staticmethod
    def listed(exits: Sequence[ReadingExit], name: str, output: int) -> str:
        return "; ".join(ExitTexts.said(EXIT_TEXTS[route], name, output) for route in exits)

    @staticmethod
    def said(text: ExitText, name: str, output: int) -> str:
        sentence = text.sentence.format(name=name, output=output)
        return f"{sentence}: {text.command.format(name=name, output=output)}" if text.command else sentence

    @staticmethod
    def template(exits: Sequence[ReadingExit]) -> str:
        return "; ".join(f"{EXIT_TEXTS[exit_case].sentence}: {EXIT_TEXTS[exit_case].command}" if EXIT_TEXTS[exit_case].command else EXIT_TEXTS[exit_case].sentence for exit_case in exits)

    @staticmethod
    def sentences(exits: Sequence[ReadingExit]) -> str:
        return "; ".join(EXIT_TEXTS[exit_case].sentence for exit_case in exits)
