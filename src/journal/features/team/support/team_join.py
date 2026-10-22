import hashlib
import socket
import ssl

from journal.db.schema import Schema
from journal.features.team.support.repository_identity import RepositoryIdentity
from journal.models.outgoing_change import CREATED, OutgoingChange
from journal.models.user import User
from journal.models.worker import Worker
from journal.repositories.outgoing_changes import OutgoingChanges
from journal.repositories.shared_tables import SharedTables
from journal.support.actor import Actor
from journal.support.rejection import Rejection
from journal.sync.sync_client import SyncClient
from journal.sync.team_account import TeamAccount
from journal.sync.team_server_link import TeamServerLink
from sync_server.copied_row import CopiedRow


class TeamJoin:
    """A journal joining its team's server: the server's own certificate authority checked against the fingerprint when it has one, the repository checked against the team's, the code and password traded for this machine's token; then a team with no journal yet takes this one whole, and a team with one gives this machine its copy and this person's user row. The sync client starts once it is done."""

    def __init__(self, account: TeamAccount, link: TeamServerLink, tables: SharedTables, outgoing: OutgoingChanges, identity: RepositoryIdentity, client: SyncClient) -> None:
        self.account, self.link, self.tables, self.outgoing, self.identity, self.client = account, link, tables, outgoing, identity, client

    def join(self, address: str, code: str, password: str, fingerprint: str, name: str) -> str:
        if self.account.is_joined():
            raise Rejection(f"this journal has joined the team at {self.account.address()} already: journal team status says how it stands")
        if fingerprint:
            self.trust(address, fingerprint)
        summary = self.link.summary(address)
        repository = self.identity.first_commit()
        if summary.repository and summary.repository != repository:
            raise Rejection(f"the team's journal belongs to the repository whose first commit is {summary.repository}, and this checkout's is {repository or 'none'}: join from a clone of the team's repository")
        login = self.link.accept(address, code, name or self.identity.person_name(), password, socket.gethostname())
        self.account.write({"address": address, "token": login.token, "device": login.device_id, "account_id": login.account_id, "sequence": 0})
        outcome = self.downloaded(login.account_id, login.name) if summary.has_rows else self.uploaded(repository)
        self.client.start()
        return outcome

    def trust(self, address: str, fingerprint: str) -> None:
        certificate = self.link.root_certificate(address)
        if hashlib.sha256(ssl.PEM_cert_to_DER_cert(certificate)).hexdigest() != fingerprint.lower():
            raise Rejection(f"the server at {address} does not hold the certificate the fingerprint names: check the join line, or the address")
        self.account.root_path().write_text(certificate)

    def uploaded(self, repository: str) -> str:
        rows = [CopiedRow(table, row.row_id, Schema.stored_values(row, None), {name: row.updated_at.timestamp() for name in Schema.stored_values(row, None)}) for table in self.tables.names() for row in self.tables.rows(table).rows()]
        highest = {table: max((row.row for row in rows if row.row_table == table), default=0) for table in self.tables.names()}
        answer = self.link.upload(rows, highest, repository)
        self.account.record_sequence(answer.head)
        self.stamp_workers()
        return f"this journal is now the team's: {answer.rows} rows uploaded"

    def downloaded(self, account_id: int, name: str) -> str:
        copy = self.link.full_copy()
        for row in copy.rows:
            if self.tables.has(row.row_table):
                self.tables.rows(row.row_table).pulled_creation(row.row, row.fields, Actor.system())
        self.account.record_sequence(copy.head)
        self.add_user(account_id, name)
        return f"joined the team: {len(copy.rows)} rows downloaded"

    def add_user(self, account_id: int, name: str) -> None:
        users = self.tables.rows(User.table())
        if users.numbered([account_id]):
            return
        user = users.pulled_creation(account_id, {"name": name}, Actor.system())
        fields = Schema.stored_values(user, None)
        self.outgoing.queued(OutgoingChange(row_table=User.table(), row=account_id, action=CREATED, fields=fields, changed_at={field: 0.0 for field in fields}, writer=Actor.user(account_id).stamp), Actor.user(account_id))

    def stamp_workers(self) -> None:
        workers = self.tables.rows(Worker.table())
        for worker in workers.rows():
            if not worker.device:
                workers.save(worker.with_(device=self.account.device()), Actor.system())
