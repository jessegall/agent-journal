from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.support.library_people import LibraryPeople
from core.modules.library.support.library_users import LibraryUsers


class LibraryUserListSubcommand(ReadSubcommand[LibraryUsers]):
    """`journal library-user list`: the users of the shared server with their roles; the server asks for an admin."""

    cli_name = "library-user"
    name = "list"

    def __init__(self, people: LibraryPeople) -> None:
        self.people = people

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> LibraryUsers:
        return self.people.users()
