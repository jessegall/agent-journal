import threading
import time
from typing import Callable

from journal.repositories.outgoing_changes import OutgoingChanges
from journal.sync.commit_signal import CommitSignal
from journal.sync.incoming_changes import IncomingChanges
from journal.sync.rejected_edits import RejectedEdits
from journal.sync.sync_status import SyncStatus
from journal.sync.team_account import TeamAccount
from journal.sync.team_change import TeamChange
from journal.sync.team_refusal import TeamRefusal
from journal.sync.team_server_link import TeamServerLink

BATCH_ROWS = 200
IDLE_SECONDS = 5
LONG_POLL_SECONDS = 25
FIRST_RETRY_SECONDS = 1
LAST_RETRY_SECONDS = 30


class SyncClient:
    """Keeps a joined journal in step with its team: a send loop pushes the queued changes oldest first in batches, woken by every commit that queues one, and a receive loop long-polls for the team's changes and applies them. On a fault both wait 1, 2, 4 seconds and so on up to 30 and try again; a change is removed from the queue only once the server answered for it, and the edits it rejected are put right here. The clock offset is measured from the server's time in each pull answer and sent with each push."""

    def __init__(self, account: TeamAccount, link: TeamServerLink, outgoing: OutgoingChanges, incoming: IncomingChanges, rejected: RejectedEdits, signal: CommitSignal, status: SyncStatus) -> None:
        self.account, self.link, self.outgoing, self.incoming, self.rejected, self.signal, self.status = account, link, outgoing, incoming, rejected, signal, status
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
        batch = self.outgoing.sending_batch(BATCH_ROWS)
        if not batch:
            self.signal.wait(IDLE_SECONDS)
            return
        answer = self.link.send_changes([change.payload() for change in batch], self.clock_offset)
        self.outgoing.sent(batch)
        self.rejected.apply(answer.rejected)
        self.status.connected()

    def receive(self) -> None:
        answer = self.link.fetch_changes(self.account.sequence(), LONG_POLL_SECONDS)
        self.clock_offset = answer.server_time - time.time()
        self.incoming.apply([TeamChange.logged(change) for change in answer.changes])
        self.account.record_sequence(answer.head)
        self.status.connected()
