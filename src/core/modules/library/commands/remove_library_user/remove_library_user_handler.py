from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.library.commands.remove_library_user.remove_library_user import RemoveLibraryUser
from core.modules.library.support.library_people import LibraryPeople
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.support.library_user import LibraryUser


class RemoveLibraryUserHandler(Handler[RemoveLibraryUser, LibraryUser]):
    """Asks the server to remove a user with no write lock held; only a person removes, and the server asks for an
    admin."""

    command = RemoveLibraryUser

    def __init__(self, people: LibraryPeople) -> None:
        self.people = people

    def handle(self, command: RemoveLibraryUser, context: Context) -> LibraryUser:
        LibraryPerson.require(context, "an agent cannot remove a user from the library")
        return self.people.remove_user(command.user_id)
