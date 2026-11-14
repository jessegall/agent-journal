from engine.driver.driver import Driver
from tests.stories.core.modules.profiles.support.notes_suite import NotesSuite


class NotesDriver(Driver):
    name = "notes.reader"
    suite_name = NotesSuite.name
    role = "reader"
