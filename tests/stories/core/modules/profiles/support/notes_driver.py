from engine.agent_machine.driver import Driver
from engine.agent_machine.needs.rank_order import RankOrder
from engine.enums.work_stop import WorkStop
from tests.stories.core.modules.profiles.support.notes_suite import NotesSuite


class NotesDriver(Driver):
    name = "notes.reader"
    suite = NotesSuite.name
    agent_type = "reader"
    rank_order = RankOrder((), ())
    work_stop = WorkStop.HANDOVER
