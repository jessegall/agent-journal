from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.library.commands.support.show_library_line_subcommand import ShowLibraryLineSubcommand
from core.modules.library.commands.revoke_library_token.revoke_library_token import RevokeLibraryToken
from core.modules.library.support.library_token import LibraryToken


class RevokeLibraryTokenSubcommand(ShowLibraryLineSubcommand[RevokeLibraryToken, LibraryToken]):
    """`journal library-user revoke <token>`: stops a token of the shared server from working."""

    cli_name = "library-user"
    name = "revoke"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("token_id", metavar="token", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RevokeLibraryToken:
        return RevokeLibraryToken(arguments.token_id)
