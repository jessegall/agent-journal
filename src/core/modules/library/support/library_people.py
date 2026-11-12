from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.support.library_token import LibraryToken
from core.modules.library.support.library_tokens import LibraryTokens
from core.modules.library.support.library_user import LibraryUser
from core.modules.library.support.library_users import LibraryUsers
from core.modules.library.support.library_writes import LibraryWrites
from core.modules.library.support.new_library_user import NewLibraryUser


class LibraryPeople:
    """The users and tokens of the shared server, for a user who administers it: the server decides who may, and an
    unreachable server is a refusal naming its address."""

    def __init__(self, client: LibraryClient, writes: LibraryWrites) -> None:
        self.client, self.writes = client, writes

    def users(self) -> LibraryUsers:
        return self.writes.reached(self.client.users)

    def tokens(self, user_id: int) -> LibraryTokens:
        return self.writes.reached(lambda: self.client.tokens(user_id))

    def add_user(self, name: str, role: LibraryRole) -> NewLibraryUser:
        return self.writes.reached(lambda: self.client.new_user(name, role))

    def set_role(self, user_id: int, role: LibraryRole) -> LibraryUser:
        return self.writes.reached(lambda: self.client.changed_user(user_id, role))

    def remove_user(self, user_id: int) -> LibraryUser:
        return self.writes.reached(lambda: self.client.removed_user(user_id))

    def revoke_token(self, token_id: int) -> LibraryToken:
        return self.writes.reached(lambda: self.client.revoked_token(token_id))
