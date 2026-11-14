from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.library.commands.revoke_library_token.revoke_library_token import RevokeLibraryToken
from core.modules.library.support.library_people import LibraryPeople
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.support.library_token import LibraryToken


class RevokeLibraryTokenHandler(Handler[RevokeLibraryToken, LibraryToken]):
    """Asks the server to revoke a token with no write lock held; only a user revokes, and the server allows an
    admin or the token's owner."""

    command = RevokeLibraryToken

    def __init__(self, people: LibraryPeople) -> None:
        self.people = people

    def handle(self, command: RevokeLibraryToken, context: Context) -> LibraryToken:
        LibraryPerson.require(context, "an agent cannot revoke a token of the library")
        return self.people.revoke_token(command.token_id)
