from events.asking import RowWriting
from features.ask_questions.choices import ON_THE_USER, enumerable, given_options, given_pick, restates, unpicked
from receiving import Refuser
from resources.base import AGENT, Refused, titled
from resources.buttons import unspent
from resources.types import TYPES, Question
from serving import ReadElsewhere, ReadRows


def asking(event: RowWriting) -> dict:
    """What a question about to be created says, or nothing when the write is not the creation of a question."""
    return dict(event.fields) if event.type == "question" and event.action == "create" else {}


def text_of(given: dict) -> str:
    return f"{given.get('title', '')}\n{given.get('abstract', '')}\n{given.get('brief', '')}"


class OptionsOnlyInTheirButtons(Refuser[RowWriting]):
    def refuse(self, event: RowWriting) -> None:
        given = asking(event)
        if given and restates(text_of(given), given_options(given.get("options"))):
            raise Refused("the options already carry their own titles and text, so the question does not list them again: "
                          "take the A/B/C or numbered option lines, or the option names, out of its title, abstract and brief")


class NamesItsPick(Refuser[RowWriting]):
    def refuse(self, event: RowWriting) -> None:
        given = asking(event)
        titles = given_options(given.get("options"))
        if given and event.actor == AGENT and unpicked(titles, given_pick(given.get("pick"))):
            raise Refused(f"name the option you would pick with --set pick=<1 to {len(titles)}>: the card marks it as the agent's pick")


class AskedOnce(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, questions: ReadRows[Question]) -> None:
        given = asking(event)
        open_one = questions.rows.by_title(titled(text_of(given).split("\n", 1)[0]), standing=True) if given else None
        if open_one:
            raise Refused(f"question {open_one.n} already asks this and is still open: wait for its answer")


class OneAskPerRow(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, elsewhere: ReadElsewhere) -> None:
        about = asking(event).get("about")
        if not about:
            return
        kind, _, n = str(about).partition(":")
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
        given = asking(event)
        if given and event.actor == AGENT and not given_options(given.get("options")) and not given.get("free") and enumerable(given.get("title", "")):
            raise Refused("this question has answers you can list (a yes or no, a which, or alternatives joined by or): give them with "
                          "--set options='[{\"title\": \"...\", \"text\": \"...\"}]' --set pick=<n>, or decide it yourself when an earlier answer settles it; "
                          "a question is open only for a name, a secret or a free description, and then says so with --set free=name|secret|description")
