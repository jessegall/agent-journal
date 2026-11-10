from dataclasses import replace

from core.modules.processes.commands.add_reader.add_reader import AddReader
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from core.modules.processes.commands.make_reader_draft.make_reader_draft import MakeReaderDraft
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_draft import ReaderDraft
from core.modules.processes.support.reader_drafting import ReaderDrafting
from core.modules.processes.support.reader_writers import ReaderWriters
from core.modules.processes.support.reader_save_refusal import ReaderSaveRefusal


class MakeReaderDraftHandler(Handler[MakeReaderDraft, ReaderDraft]):
    """Builds a reader draft and saves confirmed drafts through the normal reader command."""

    command = MakeReaderDraft

    def __init__(self, requests: ReaderRequestQuery, drafting: ReaderDrafting, writers: ReaderWriters, bus: Bus) -> None:
        self.requests, self.drafting, self.writers, self.bus = requests, drafting, writers, bus

    def handle(self, command: MakeReaderDraft, context: Context) -> ReaderDraft:
        request = self.requests.find(command.request_id)
        if not command.save:
            return self.drafting.draft(request)
        self.writers.check_request(context.actor, request)
        try:
            return self.save_draft(command, context)
        except Refusal as refusal:
            if self.writers.allows(context.actor):
                raise
            raise ReaderSaveRefusal.failed_save(request.id, refusal) from refusal

    def save_draft(self, command: MakeReaderDraft, context: Context) -> ReaderDraft:
        request = self.requests.find(command.request_id)
        draft = self.drafting.draft(request)
        if draft.missing:
            if not self.writers.allows(context.actor):
                self.writers.check_attempts(request)
            raise Refusal("; ".join(f"could not fill {field}" for field in draft.missing), "write the missing fields on the reader add line")
        self.bus.dispatch(AddReader(draft.name, commands=draft.commands, title=draft.title, lines=draft.lines,
                                   progress=draft.progress, summary=draft.summary, count=draft.count, count_command=draft.count_command,
                                   script=draft.script, step=draft.step, finished=draft.finished, failed=draft.failed,
                                   topic=draft.topic, subject=draft.subject), context)
        return replace(draft, matches=(*draft.matches, f"saved reader {draft.name}"))
