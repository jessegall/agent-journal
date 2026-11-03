from dataclasses import replace

from core.modules.processes.commands.add_reader.add_reader import AddReader
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.processes.commands.make_reader_draft.make_reader_draft import MakeReaderDraft
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_draft import ReaderDraft
from core.modules.processes.support.reader_drafting import ReaderDrafting
from core.modules.processes.support.reader_writers import ReaderWriters


class MakeReaderDraftHandler(Handler[MakeReaderDraft, ReaderDraft]):
    """Builds a reader draft and saves confirmed drafts through the normal reader command."""

    command = MakeReaderDraft

    def __init__(self, requests: ReaderRequestQuery, drafting: ReaderDrafting, writers: ReaderWriters, bus: Bus) -> None:
        self.requests, self.drafting, self.writers, self.bus = requests, drafting, writers, bus

    def handle(self, command: MakeReaderDraft, context: Context) -> ReaderDraft:
        if command.save:
            self.writers.check(context.actor)
        draft = self.drafting.draft(self.requests.find(command.request_id))
        if command.save:
            if draft.missing:
                raise Refusal("; ".join(f"could not fill {field}" for field in draft.missing), "write the missing fields on the reader add line")
            self.bus.dispatch(AddReader(draft.name, commands=draft.commands, title=draft.title, lines=draft.lines,
                                       progress=draft.progress, summary=draft.summary, count=draft.count, count_command=draft.count_command,
                                       script=draft.script, step=draft.step, finished=draft.finished, failed=draft.failed,
                                       topic=draft.topic, subject=draft.subject), context)
            return replace(draft, matches=(*draft.matches, f"saved reader {draft.name}"))
        return draft
