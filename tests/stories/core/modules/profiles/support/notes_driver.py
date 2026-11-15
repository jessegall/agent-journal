from engine.agent_machine.driver import Driver
from core.modules.drivers.drivers.helper.helper_agent_driver import HelperAgentDriver
from engine.enums.work_stop import WorkStop
from tests.stories.core.modules.profiles.support.notes_suite import NotesSuite


class NotesDriver(Driver):
    name = "notes.reader"
    suite = NotesSuite.name
    agent_type = "reader"
    gathers = [HelperAgentDriver]
    rank_order = HelperAgentDriver.rank_order
    work_stop = WorkStop.HANDOVER
