from core.base.command.handler import Handler

PAGE_SIZE = 5
# @sin naming_UnitlessQuantityNameDetector
WAIT = 5
# @righteous naming_UnitlessQuantityNameDetector
WAIT_SECONDS = 5
# @sin syntax_OneElementTupleDetector
SOLE = ("only",)
# @righteous syntax_OneElementTupleDetector
PAIR = ("first", "second")


# @sin naming_PoeticTypeNameDetector
# @sin architecture_core_OneClassPerFileDetector
class WordedNote:
    """A class named for a word that says nothing."""


# @sin naming_SentenceTypeNameDetector
# @sin architecture_core_OneClassPerFileDetector
class TheNote:
    """A class named as the start of a sentence."""


# @righteous naming_PoeticTypeNameDetector
# @righteous naming_SentenceTypeNameDetector
# @sin architecture_core_OneClassPerFileDetector
class NoteLine:
    """A class named for what it holds."""

    # @sin naming_PoeticMethodNameDetector
    def whisper(self) -> str:
        return "x"

    # @sin naming_PoeticMethodNameDetector
    # @sin naming_SentenceMethodNameDetector
    def by_the_hour(self) -> str:
        return "x"

    # @righteous naming_PoeticMethodNameDetector
    # @righteous naming_SentenceMethodNameDetector
    def hourly(self) -> str:
        return "x"

    # @sin naming_PoeticParameterNameDetector
    def tale(self, magic: str) -> str:
        # @sin naming_PoeticVariableNameDetector
        # @sin naming_SentenceVariableNameDetector
        of_the_day = magic
        # @sin naming_PoeticVariableNameDetector
        # @sin naming_SentenceVariableNameDetector
        thing = of_the_day
        # @sin naming_PoeticVariableNameDetector
        return thing

    # @sin naming_PoeticMethodNameDetector
    # @sin naming_SentenceMethodNameDetector
    # @sin naming_SentenceParameterNameDetector
    def held(self, in_the_hour: str, text: str) -> str:
        # @righteous naming_PoeticVariableNameDetector
        line = text
        # @sin naming_SentenceVariableNameDetector
        return line + in_the_hour


# @sin naming_LongDocstringLineDetector
# @sin architecture_core_OneClassPerFileDetector
class LongNote: """A docstring line that runs past one hundred and ten characters is cut in two, and this one does not stop where it should, so it is flagged."""


# @righteous naming_LongDocstringLineDetector
# @sin architecture_core_OneClassPerFileDetector
class ShortNote: """A docstring whose lines stay short."""


# @sin naming_ClassNamedForItsBaseDetector
# @sin architecture_layout_CommandsInCommandsFolderDetector
# @sin naming_CommandAsAnOrderDetector
# @sin architecture_core_OneClassPerFileDetector
class Notes(Handler):
    """A handler that does not end in Handler."""
