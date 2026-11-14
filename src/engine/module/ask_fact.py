from dataclasses import dataclass


@dataclass(frozen=True)
class AskFact:
    """One labelled line of what a question carries about its asker, such as its job title."""

    label: str
    text: str
