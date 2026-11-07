from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.library.commands.support.show_library_line_subcommand import ShowLibraryLineSubcommand
from core.modules.library.commands.add_library_user.add_library_user import AddLibraryUser
from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.new_library_user import NewLibraryUser


class AddLibraryUserSubcommand(ShowLibraryLineSubcommand[AddLibraryUser, NewLibraryUser]):
    """`journal library-user add <name> [--role admin|edit|read]`: adds a user to the shared server and prints their
    first token once; nothing here keeps it."""

    cli_name = "library-user"
    name = "add"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("user_name", metavar="name")
        parser.add_argument("--role", dest="user_role", choices=[role.value for role in LibraryRole], default=LibraryRole.READ.value)

    def command(self, arguments: Namespace, caller: Caller) -> AddLibraryUser:
        return AddLibraryUser(arguments.user_name, LibraryRole(arguments.user_role))
