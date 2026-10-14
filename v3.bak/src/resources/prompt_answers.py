from dataclasses import dataclass


@dataclass(frozen=True)
class PromptAnswer:
    """The answer to the question an agent stands at on its own screen: the option pressed, or, with none, the words typed into the last choice of the options it offers."""

    option: int
    text: str
    options: int
