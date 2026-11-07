from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.library.commands.support.show_library_line_subcommand import ShowLibraryLineSubcommand
from core.modules.library.commands.remove_library_user.remove_library_user import RemoveLibraryUser
from core.modules.library.support.library_user import LibraryUser


class RemoveLibraryUserSubcommand(ShowLibraryLineSubcommand[RemoveLibraryUser, LibraryUser]):
    """`journal library-user remove <user>`: removes a user from the shared server."""

    cli_name = "library-user"
    name = "remove"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("user_id", metavar="user", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RemoveLibraryUser:
        return RemoveLibraryUser(arguments.user_id)
