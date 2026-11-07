from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.library.commands.add_library_user.add_library_user import AddLibraryUser
from core.modules.library.support.library_people import LibraryPeople
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.support.new_library_user import NewLibraryUser


class AddLibraryUserHandler(Handler[AddLibraryUser, NewLibraryUser]):
    """Asks the server to add a user with no write lock held; only a person adds, and the server asks for an admin."""

    command = AddLibraryUser

    def __init__(self, people: LibraryPeople) -> None:
        self.people = people

    def handle(self, command: AddLibraryUser, context: Context) -> NewLibraryUser:
        LibraryPerson.require(context, "an agent cannot add a user to the library", "ask the user to add them on the Teams page")
        return self.people.add_user(command.name, command.role)
