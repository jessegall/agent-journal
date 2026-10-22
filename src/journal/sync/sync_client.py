import threading
import time
from typing import Callable

from journal.sync.attachments import Attachments
from journal.repositories.id_blocks import IdBlocks
from journal.repositories.pending_uploads import PendingUploads
from journal.support.actor import Actor
from journal.repositories.outgoing_changes import OutgoingChanges
from journal.repositories.shared_tables import SharedTables
from journal.sync.commit_signal import CommitSignal
from journal.sync.incoming_changes import IncomingChanges
from journal.sync.rejected_edits import RejectedEdits
from journal.sync.sync_status import SyncStatus
from journal.sync.team_account import TeamAccount
from journal.sync.team_change import TeamChange
from journal.sync.team_refusal import TeamRefusal
from journal.sync.team_server_link import TeamServerLink
from sync_server.file_place import FilePlace

BATCH_ROWS = 200
IDLE_SECONDS = 5
LONG_POLL_SECONDS = 25
FIRST_RETRY_SECONDS = 1
LAST_RETRY_SECONDS = 30


class SyncClient:
    """Keeps a joined journal in step with its team: a send loop pushes the queued changes oldest first in batches, woken by every commit that queues one, and a receive loop long-polls for the team's changes and applies them. On a fault both wait 1, 2, 4 seconds and so on up to 30 and try again; a change is removed from the queue only once the server answered for it, and the edits it rejected are put right here; once it has taken a batch it sends every file attached here that the server lacks, before the batch, so no change in it names a file the server has not got, and asks for a block of row numbers for every shared table that holds less than a block and a fifth. The clock offset is measured from the server's time in each pull answer and sent with each push."""

    def __init__(self, account: TeamAccount, link: TeamServerLink, outgoing: OutgoingChanges, incoming: IncomingChanges, rejected: RejectedEdits, signal: CommitSignal, status: SyncStatus, blocks: IdBlocks, tables: SharedTables, uploads: PendingUploads, attachments: Attachments) -> None:
        self.account, self.link, self.outgoing, self.incoming, self.rejected, self.signal, self.status = account, link, outgoing, incoming, rejected, signal, status
        self.blocks, self.tables, self.uploads, self.attachments = blocks, tables, uploads, attachments
        self.stopping = threading.Event()
        self.clock_offset = 0.0
        self.sender = threading.Thread()

    def start(self) -> None:
        if not self.account.is_joined():
            return
        self.stopping.clear()
        self.sender = threading.Thread(target=self.repeated, args=(self.send,), daemon=True)
        self.sender.start()
        threading.Thread(target=self.repeated, args=(self.receive,), daemon=True).start()

    def stop(self) -> None:
        self.stopping.set()
        self.signal.ring()
        if self.sender.is_alive():
            self.sender.join(LAST_RETRY_SECONDS)

    def repeated(self, loop: Callable[[], None]) -> None:
        delay = FIRST_RETRY_SECONDS
        while not self.stopping.is_set():
            try:
                loop()
                delay = FIRST_RETRY_SECONDS
            except (OSError, TeamRefusal) as fault:
                self.status.failed(str(fault))
                self.stopping.wait(delay)
                delay = min(delay * 2, LAST_RETRY_SECONDS)

    def send(self) -> None:
        self.refill()
        batch = self.outgoing.sending_batch(BATCH_ROWS)
        self.upload_files()
        if not batch:
            self.signal.wait(IDLE_SECONDS)
            return
        answer = self.link.send_changes([change.payload() for change in batch], self.clock_offset)
        self.outgoing.sent(batch)
        self.rejected.apply(answer.rejected)
        self.status.connected()

    def upload_files(self) -> None:
        for upload in self.uploads.waiting():
            path = self.attachments.path(upload.row_table, upload.row, upload.name)
            if path.is_file():
                self.link.upload_file(FilePlace(upload.row_table, upload.row, upload.name), path.read_bytes())
            self.uploads.delete(upload, Actor.system())

    def refill(self) -> None:
        wanted = [table for table in self.tables.names() if self.blocks.is_wanted(table)]
        if wanted:
            for grant in self.link.fetch_blocks(wanted).blocks:
                self.blocks.add(grant.row_table, grant.first, grant.last)

    def receive(self) -> None:
        answer = self.link.fetch_changes(self.account.sequence(), LONG_POLL_SECONDS)
        self.clock_offset = answer.server_time - time.time()
        self.incoming.apply([TeamChange.logged(change) for change in answer.changes])
        self.account.record_sequence(answer.head)
        self.status.connected()
