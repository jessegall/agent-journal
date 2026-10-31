from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.suggestions.commands.answer_suggestion import AnswerSuggestion
from core.modules.suggestions.models.enums.suggestion_answer import SuggestionAnswer
from core.modules.suggestions.models.suggestion import Suggestion


class AnswerSuggestionSubcommand(Subcommand[AnswerSuggestion, Suggestion]):
    """`journal suggestion answer <n> accepted|declined`."""

    cli_name = "suggestion"
    name = "answer"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("answer", choices=[answer.value for answer in SuggestionAnswer])

    def command(self, arguments: Namespace, caller: Caller) -> AnswerSuggestion:
        return AnswerSuggestion(arguments.id, SuggestionAnswer(arguments.answer))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Suggestion):
            output.line(f"suggestion {value.id} {value.answer}")
