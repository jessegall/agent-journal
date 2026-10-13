"""What the templates feature recognises: a row made from a template, and work whose row follows one."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class TemplateChosen(Fact):
    """A row made from a template, which starts with the template's parts, filled in, and links the template."""

    type: str
    n: int
    ref: str
    sections: tuple[tuple[str, str], ...]


@dataclass(frozen=True, kw_only=True)
class TemplateToRead(Fact):
    """The agent is to read the instructions of the template the work it is on follows."""

    agent: int
    n: int
    title: str
    brief: str
