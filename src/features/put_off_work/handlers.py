from events import Fact
from events.put_off_work import WorkDeferred
from features.work_modes.details import ORCHESTRATOR
from features.work_modes.modes import board_in, filing_on, kept_mode
from receiving import Handler
from resources.types import Board
from serving import Chat, Rows, Settings


class NameTheDeferral(Handler[WorkDeferred]):
    def handle(self, event: WorkDeferred, chat: Chat, settings: Settings, boards: Rows[Board]) -> list[Fact]:
        modes = settings.of("work_modes")
        board = board_in(boards, int(modes.board)) if kept_mode(modes.mode) == ORCHESTRATOR else None
        chat.say("deferred", words=event.words, filing=filing_on(board))
        return []
