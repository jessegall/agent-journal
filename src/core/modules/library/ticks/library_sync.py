from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.library.library_item import LibraryItem
from core.base.model.model import Model
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.stale_row_error import StaleRowError
from core.modules.library.commands.delete_library_copy.delete_library_copy import DeleteLibraryCopy
from core.modules.library.commands.merge_library_item.merge_library_item import MergeLibraryItem
from core.modules.library.commands.update_library_connection.update_library_connection import UpdateLibraryConnection
from core.modules.library.commands.update_library_copy.update_library_copy import UpdateLibraryCopy
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.agent_edits import AgentEdits
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.support.library_denied_error import LibraryDeniedError
from core.modules.library.support.library_item_removed_error import LibraryItemRemovedError
from core.modules.library.support.library_rejected_error import LibraryRejectedError
from core.modules.library.support.library_shares import LibraryShares
from core.modules.library.support.library_stale_error import LibraryStaleError
from core.modules.library.support.library_stopped_error import LibraryStoppedError
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.round_memory import RoundMemory
from core.modules.library.support.server_state import ServerState
from core.modules.library.support.sync_outcome import SyncOutcome

MODULE_NAME = "journal.core.library"
REACHED_NOTE_SECONDS = 60


class LibrarySync:
    """One sync round: reads the server's list, then compares each copy with it. All network work happens here,
    outside any transaction, and each result is saved in a short command of its own, so a slow server never
    holds the journal's write lock. One copy's failure stops no other."""

    def __init__(self, client: LibraryClient, shares: LibraryShares, queries: Queries, connections: LibraryConnectionQuery, bus: Bus, actors: ModuleActors, clock: Clock,
                 agent_edits: AgentEdits) -> None:
        self.client, self.shares, self.queries, self.connections, self.bus, self.clock = client, shares, queries, connections, bus, clock
        self.agent_edits = agent_edits
        self.actor = actors.actor(MODULE_NAME)

    def round(self, memory: RoundMemory) -> SyncOutcome:
        connection = self.connections.current()
        if connection is None:
            return SyncOutcome.idle(LibraryStoppedError.disconnected().reason)
        if not self.client.is_connected:
            return SyncOutcome.idle(connection.stopped)
        try:
            state = self.state(connection, memory)
            results = [self.sync_safely(copy, state, memory) for copy in list(self.queries.query(LibraryCopy).all_rows())]
        except LibraryUnreachableError as failure:
            return self.note_failure(connection, failure)
        except LibraryStoppedError as stopped:
            return self.note_stopped(connection, stopped)
        return self.note_reached(connection, state, results)

    def state(self, connection: LibraryConnection, memory: RoundMemory) -> ServerState:
        state = self.client.state() if memory.state is None else self.client.newest_state(memory.state)
        if state.server_key != connection.server_key:
            raise LibraryStoppedError.changed_server()
        memory.state = state
        return state

    def sync_safely(self, copy: LibraryCopy, state: ServerState, memory: RoundMemory) -> bool:
        try:
            return self.sync_copy(copy, state, memory)
        except (LibraryStoppedError, LibraryUnreachableError):
            raise
        except (LibraryItemRemovedError, StaleRowError):
            return False
        except Refusal as failure:
            memory.skip(copy, state.entry(copy.share, copy.item_id))
            return copy.note != str(failure) and self.save(UpdateLibraryCopy(copy.id, copy.state, note=str(failure)))

    def sync_copy(self, copy: LibraryCopy, state: ServerState, memory: RoundMemory) -> bool:
        share = self.shares.lookup(copy.share)
        row = self.queries.query(share.model).filter(id=copy.row_id).first()
        if row is None or share.is_removed(row):
            return self.save(DeleteLibraryCopy(copy.id))
        entry = state.entry(copy.share, copy.item_id)
        if entry.is_removed:
            return self.mark(copy, CopyState.REMOVED)
        digest = share.digest(row)
        local_changed, server_changed = digest != copy.base_digest, entry.version != copy.base_version
        if not local_changed and not server_changed:
            return self.mark(copy, CopyState.SYNCED)
        if memory.is_skipped(copy, entry) or copy.is_recorded(digest, entry.version, state.role):
            return False
        if server_changed and not local_changed and share.is_paused(row):
            return copy.server_version != entry.version and self.save(UpdateLibraryCopy(copy.id, copy.state, server_version=entry.version))
        if server_changed:
            return self.compare(copy, row, self.client.item(copy.share, copy.item_id), digest, state.role)
        if self.agent_edits.edit_waits(row):
            return self.save(UpdateLibraryCopy(copy.id, CopyState.AGENT, note="", unsent_digest=digest, server_version=copy.base_version))
        return self.send(copy, row, digest, state.role)

    def send(self, copy: LibraryCopy, row: Model, digest: str, role: LibraryRole) -> bool:
        try:
            item = self.client.update(copy.share, copy.item_id, copy.base_version, self.shares.lookup(copy.share).fields(row))
        except LibraryDeniedError:
            return self.save(UpdateLibraryCopy(copy.id, CopyState.DENIED, note="", unsent_digest=digest, server_version=copy.base_version))
        except LibraryRejectedError as refusal:
            return self.save(UpdateLibraryCopy(copy.id, CopyState.REJECTED, note=str(refusal), unsent_digest=digest, server_version=copy.base_version))
        except LibraryStaleError as stale:
            return self.compare(copy, row, stale.current, digest, role)
        return self.save(UpdateLibraryCopy.synced(copy.id, item.version, digest))

    def compare(self, copy: LibraryCopy, row: Model, item: LibraryItem, digest: str, role: LibraryRole) -> bool:
        share = self.shares.lookup(copy.share)
        if share.fields_digest(item.fields) == digest:
            return self.save(UpdateLibraryCopy.synced(copy.id, item.version, digest))
        if digest != copy.base_digest or item.version < copy.base_version:
            return self.save(UpdateLibraryCopy(copy.id, CopyState.CONFLICT if role.may_write else CopyState.DENIED, unsent_digest=digest, server_version=item.version,
                                               server_fields=item.fields_text))
        reason = share.needs_reading(row, item.fields)
        if reason:
            return self.save(UpdateLibraryCopy(copy.id, CopyState.REVIEW, note=reason, unsent_digest=digest, server_version=item.version, server_fields=item.fields_text))
        return self.save(MergeLibraryItem(copy.id, item, row.version))

    def mark(self, copy: LibraryCopy, copy_state: CopyState) -> bool:
        if copy.state is copy_state:
            return False
        return self.save(UpdateLibraryCopy.synced(copy.id) if copy_state is CopyState.SYNCED else UpdateLibraryCopy(copy.id, copy_state))

    def save(self, command: Command[object]) -> bool:
        self.bus.run(command, self.actor)
        return True

    def note_reached(self, connection: LibraryConnection, state: ServerState, results: list[bool]) -> SyncOutcome:
        last_note_old = connection.reached_at is None or connection.reached_at.elapsed_seconds(self.clock.timestamp()) >= REACHED_NOTE_SECONDS
        role_changed = state.role is not connection.role
        needs_note = last_note_old or role_changed or bool(connection.failure)
        if needs_note:
            self.save(UpdateLibraryConnection(state.role, has_reached=True))
        return SyncOutcome.reached(len(results), sum(results), any(results))

    def note_failure(self, connection: LibraryConnection, failure: LibraryUnreachableError) -> SyncOutcome:
        has_changed = connection.failure != failure.reason and self.save(UpdateLibraryConnection(connection.role, failure=failure.reason))
        return SyncOutcome.failed(failure.reason, has_changed)

    def note_stopped(self, connection: LibraryConnection, stopped: LibraryStoppedError) -> SyncOutcome:
        has_changed = connection.stopped != stopped.reason and self.save(UpdateLibraryConnection(connection.role, stopped=stopped.reason))
        return SyncOutcome.failed(stopped.reason, has_changed)
