from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.support.cards import Cards
from journal.features.search.search import Search
from journal.support.scope import Scope


class SearchCommand(Command):
    """journal search "<words>": every row and conversation here that holds all the words, and a mark in the chat that opens what was found."""

    noun = "search"
    default_verb = "for"

    def __init__(self, search: Search, cards: Cards, scope: Scope) -> None:
        self.search, self.cards, self.scope = search, cards, scope

    def arguments(self, verbs) -> None:
        verbs_for = self.verb(verbs, "for", "find the rows and conversations here that hold every one of the words")
        verbs_for.add_argument("words", nargs="+")

    def for_(self, args: Namespace, where: Where) -> int:
        words = " ".join(args.words).split()
        lines = [found.line() for found in self.search.found(words)]
        said = "\n".join(lines) if lines else f"nothing here holds all of: {' '.join(words)}"
        print(said)
        self.cards.show(self.scope.id, where.session, f"Searched for \"{' '.join(words)}\"", "search", detail=said, kind="search")
        return 0
