from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.support.library_people import LibraryPeople
from core.modules.library.support.library_tokens import LibraryTokens


class LibraryUserTokensSubcommand(ReadSubcommand[LibraryTokens]):
    """`journal library-user tokens <user>`: the tokens of a user with label and last use, never their text."""

    cli_name = "library-user"
    name = "tokens"

    def __init__(self, people: LibraryPeople) -> None:
        self.people = people

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("user_id", metavar="user", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> LibraryTokens:
        return self.people.tokens(arguments.user_id)
