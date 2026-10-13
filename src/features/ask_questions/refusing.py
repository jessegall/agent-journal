from dataclasses import dataclass

from events.asking import RowWriting
from features.ask_questions.choices import ON_THE_USER, enumerable, given_options, given_pick, restates, unpicked
from receiving import Refuser
from resources.base import AGENT, Refused, titled
from resources.buttons import unspent
from resources.types import TYPES, Question
from serving import ReadElsewhere, ReadRows


@dataclass(frozen=True)
class Asking:
    """What a question about to be created says, read once from the write that creates it."""

    title: str
    abstract: str
    brief: str
    options: object
    pick: object
    about: str | None
    """The row the question is about, as type:number, when it names one."""
    free: str | None
    """What kind of free answer it asks for, when it lists no options."""

    @classmethod
    def of(cls, event: RowWriting) -> "Asking | None":
        """The question a write creates, or none when the write is not the creation of a question."""
        if event.type != "question" or event.action != "create":
            return None
        given = dict(event.fields)
        return cls(given["title"], given["abstract"], given["brief"], given.get("options"), given.get("pick"), given.get("about"), given.get("free"))

    @property
    def text(self) -> str:
        return f"{self.title}\n{self.abstract}\n{self.brief}"


class OptionsOnlyInTheirButtons(Refuser[RowWriting]):
    def refuse(self, event: RowWriting) -> None:
        given = Asking.of(event)
        if given and restates(given.text, given_options(given.options)):
            raise Refused("the options already carry their own titles and text, so the question does not list them again: "
                          "take the A/B/C or numbered option lines, or the option names, out of its title, abstract and brief")


class NamesItsPick(Refuser[RowWriting]):
    def refuse(self, event: RowWriting) -> None:
        given = Asking.of(event)
        if given and event.actor == AGENT and unpicked(titles := given_options(given.options), given_pick(given.pick)):
            raise Refused(f"name the option you would pick with --set pick=<1 to {len(titles)}>: the card marks it as the agent's pick")


class AskedOnce(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, questions: ReadRows[Question]) -> None:
        given = Asking.of(event)
        open_one = questions.rows.by_title(titled(given.title), standing=True) if given else None
        if open_one:
            raise Refused(f"question {open_one.n} already asks this and is still open: wait for its answer")


class OneAskPerRow(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, elsewhere: ReadElsewhere) -> None:
        given = Asking.of(event)
        if not given or not given.about:
            return
        kind, _, n = str(given.about).partition(":")
        rows = elsewhere.here().rows_named(kind).rows if kind in TYPES and n.isdigit() else None
        if rows and rows.exists(int(n)) and any(button.choice for button in unspent(rows.peek(int(n)))):
            raise Refused(f"{kind} {n} already asks this through its buttons: wait for that answer, or take its buttons off first")


class WaitsOnTheUserByAQuestion(Refuser[RowWriting]):
    def refuse(self, event: RowWriting) -> None:
        if event.type != "todo" or event.action != "block" or event.actor != AGENT:
            return
        given = dict(event.fields)
        if ON_THE_USER.search(str(given["why"])):
            raise Refused(f"a to-do that waits on the user carries a question they can answer, not a block: journal todo ask {given['n']} \"<the decision>\" "
                          "--set options='[{\"title\": \"...\", \"text\": \"...\"}]' --set pick=<n>, and the answer reaches you when it is given; "
                          "a block is for what happens outside, such as a release or another machine")


class OptionsWhenEnumerable(Refuser[RowWriting]):
    def refuse(self, event: RowWriting) -> None:
        given = Asking.of(event)
        if given and event.actor == AGENT and not given_options(given.options) and not given.free and enumerable(given.title):
            raise Refused("this question has answers you can list (a yes or no, a which, or alternatives joined by or): give them with "
                          "--set options='[{\"title\": \"...\", \"text\": \"...\"}]' --set pick=<n>, or decide it yourself when an earlier answer settles it; "
                          "a question is open only for a name, a secret or a free description, and then says so with --set free=name|secret|description")
