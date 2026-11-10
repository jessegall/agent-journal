from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.modules.library.commands.support.show_library_line_subcommand import ShowLibraryLineSubcommand
from core.modules.library.commands.set_library_role.set_library_role import SetLibraryRole
from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.library_user import LibraryUser


class SetLibraryRoleSubcommand(ShowLibraryLineSubcommand[SetLibraryRole, LibraryUser]):
    """`journal library-user role <user> <admin|edit|read>`: gives a user of the shared server another role."""

    cli_name = "library-user"
    name = "role"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("user_id", metavar="user", type=int)
        parser.add_argument("user_role", metavar="role", choices=[role.value for role in LibraryRole])

    def command(self, arguments: Namespace, caller: Caller) -> SetLibraryRole:
        return SetLibraryRole(arguments.user_id, LibraryRole(arguments.user_role))
