from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.library.commands.set_library_role.set_library_role import SetLibraryRole
from core.modules.library.support.library_people import LibraryPeople
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.support.library_user import LibraryUser


class SetLibraryRoleHandler(Handler[SetLibraryRole, LibraryUser]):
    """Asks the server to change a role with no write lock held; only a person changes it, and the server asks for an
    admin."""

    command = SetLibraryRole

    def __init__(self, people: LibraryPeople) -> None:
        self.people = people

    def handle(self, command: SetLibraryRole, context: Context) -> LibraryUser:
        LibraryPerson.require(context, "an agent cannot change a role in the library", "ask the user to change it on the Teams page")
        return self.people.set_role(command.user_id, command.role)
