from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.phone.commands.note_phone_notice import NotePhoneNotice
from core.modules.phone.models.enums.phone_state import PhoneState
from core.modules.phone.models.phone import Phone


class NotePhoneNoticeHandler(Handler[NotePhoneNotice, int]):
    """Marks each paired phone with a subscription as having a notice waiting; the ticker's round pushes it."""

    command = NotePhoneNotice

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: NotePhoneNotice, context: Context) -> int:
        phones = [phone for phone in self.queries.query(Phone).filter(state=PhoneState.PAIRED, notice_waiting=False).all_rows() if phone.endpoint is not None]
        for phone in phones:
            self.repository.save(phone.changed(notice_waiting=True), context)
        return len(phones)
