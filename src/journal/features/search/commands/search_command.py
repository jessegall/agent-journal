from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.support.cards import Cards
from journal.features.search.support.search import CONVERSATION, Search
from journal.support.scope import Scope
from journal.support.chat_mark import ChatMark


class SearchCommand(Command):
    """journal search "<words>" [--model message,plan]: every row here that holds all the words, in every model or the ones named, and a mark in the chat that opens what was found."""

    noun = "search"
    default_verb = "for"

    def __init__(self, search: Search, cards: Cards, scope: Scope) -> None:
        self.search, self.cards, self.scope = search, cards, scope

    def arguments(self, verbs) -> None:
        verbs_for = self.verb(verbs, "for", "find the rows and conversations here that hold every one of the words")
        verbs_for.add_argument("words", nargs="+")
        verbs_for.add_argument("--model", default="", help=f"only these models, by name and comma apart: {', '.join(self.search.models())}; {CONVERSATION} reads the agents' conversations too")

    def for_(self, args: Namespace, caller: Caller) -> int:
        words = " ".join(args.words).split()
        found = self.search.found_in(words, args.model.split(",")) if args.model else self.search.found(words)
        lines = [one.line() for one in found]
        said = "\n".join(lines) if lines else f"nothing here holds all of: {' '.join(words)}"
        print(said)
        self.cards.show(self.scope.id, caller.session, f"Searched for \"{' '.join(words)}\"", "search", detail=said, kind="search", shows=ChatMark.SEARCHES)
        return 0
