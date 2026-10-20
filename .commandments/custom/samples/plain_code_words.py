# @sin PoeticTypeNameDetector
class Said:
    """A line with its values filled in."""

    text: str = ""
    # @sin FieldDocstringDetector
    """The words of the line."""

    # @sin PoeticMethodNameDetector
    # @sin DocstringInMethodDetector
    def about(self, n: int) -> str:
        """Fills the blanks."""
        # the first blank is the number
        return str(n)


# @righteous PoeticTypeNameDetector
class Nudge:
    """A line a feature says to the agent, declared once with its blanks."""

    # @righteous FieldDocstringDetector
    text: str = ""

    # @righteous PoeticMethodNameDetector
    # @righteous DocstringInMethodDetector
    def create(self, n: int) -> str:
        return str(n)

    # @righteous DocstringInMethodDetector
    def states(self) -> list: ...


    # @sin PoeticParameterNameDetector
    def say(self, said: str) -> str:
        # @sin PoeticVariableNameDetector
        meaning = said
        return meaning

    # @righteous PoeticParameterNameDetector
    def render(self, line: str) -> str:
        # @righteous PoeticVariableNameDetector
        words = line
        return words

    # @righteous DocstringInMethodDetector
    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "every registered nudge")
