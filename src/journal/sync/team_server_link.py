import json
import ssl
import urllib.error
import urllib.request

from journal.db.schema import Schema
from journal.sync.team_account import TeamAccount
from journal.sync.team_refusal import TeamRefusal
from sync_server.blocks_answer import BlocksAnswer
from sync_server.copied_row import CopiedRow
from sync_server.device import Device
from sync_server.device_list import DeviceList
from sync_server.file_place import FilePlace
from sync_server.full_copy import FullCopy
from sync_server.invitation_answer import InvitationAnswer
from sync_server.login_answer import LoginAnswer
from sync_server.login_request import LoginRequest
from sync_server.pull_answer import PullAnswer
from sync_server.push_answer import PushAnswer
from sync_server.team_summary import TeamSummary
from sync_server.upload_answer import UploadAnswer
from sync_server.lease import Lease
from journal.version import VERSION
from sync_server.protocol import MIGRATION_HEADER, PROTOCOL, PROTOCOL_HEADER, UNVERSIONED, VERSION_HEADER

REQUEST_SECONDS = 10
COPY_SECONDS = 120
ROOT_CERTIFICATE = "/root.crt"


class TeamServerLink:
    """The one way the journal reaches its team server, each request with the device's token: a push of queued changes, a pull past a sequence, a request for blocks of row numbers, the full copy, and the joining and admin requests. A server on a bare address is trusted through the certificate authority the join kept. Each request names this journal's protocol, its version and the migration its database is at, and an answer from a server on an older one is refused with the line to upgrade the server. A network fault is raised as the OSError it is; a refusal as a TeamRefusal."""

    def __init__(self, account: TeamAccount, schema: Schema) -> None:
        self.account, self.schema = account, schema

    def send_changes(self, changes: list[dict], clock_offset: float) -> PushAnswer:
        return PushAnswer.parsed(**json.loads(self.posted("/push", {"changes": changes, "clock_offset": clock_offset})))

    def fetch_changes(self, sequence: int, wait_seconds: float) -> PullAnswer:
        return PullAnswer.parsed(**json.loads(self.sent(self.account.address(), f"/pull?after={sequence}&wait={wait_seconds}", None, wait_seconds + REQUEST_SECONDS)))

    def fetch_blocks(self, tables: list[str]) -> BlocksAnswer:
        return BlocksAnswer.parsed(**json.loads(self.posted("/blocks", {"tables": tables})))

    def full_copy(self) -> FullCopy:
        return FullCopy.parsed(**json.loads(self.sent(self.account.address(), "/copy", None, COPY_SECONDS)))

    def upload(self, rows: list[CopiedRow], highest: dict, repository: str, version: str) -> UploadAnswer:
        body = json.dumps({"rows": [row.__dict__ for row in rows], "highest": highest, "repository": repository, "version": version, "migration": self.schema.version()}).encode()
        return UploadAnswer(**json.loads(self.sent(self.account.address(), "/upload", body, COPY_SECONDS)))

    def upgrade(self, rows: list[CopiedRow], highest: dict, base_sequence: int) -> UploadAnswer:
        body = json.dumps({"rows": [row.__dict__ for row in rows], "highest": highest, "migration": self.schema.version(), "base_sequence": base_sequence}).encode()
        return UploadAnswer(**json.loads(self.sent(self.account.address(), "/upgrade", body, COPY_SECONDS)))

    def invite(self, email: str) -> InvitationAnswer:
        return InvitationAnswer(**json.loads(self.posted("/invite", {"email": email})))

    def devices(self) -> DeviceList:
        return DeviceList.parsed(**json.loads(self.sent(self.account.address(), "/devices", None, REQUEST_SECONDS)))

    def pin_version(self, version: str) -> TeamSummary:
        return TeamSummary(**json.loads(self.posted("/team/version", {"version": version})))

    def allow_versions(self, rule: str) -> TeamSummary:
        return TeamSummary(**json.loads(self.posted("/team/versions", {"versions": rule})))

    def revoke(self, device_id: int) -> Device:
        return Device(**json.loads(self.posted("/devices/revoke", {"device_id": device_id})))

    def summary(self, address: str) -> TeamSummary:
        return TeamSummary(**json.loads(self.sent(address, "/team", None, REQUEST_SECONDS)))

    def accept(self, address: str, code: str, name: str, password: str, device_name: str) -> LoginAnswer:
        body = json.dumps({"code": code, "name": name, "password": password, "password_repeat": password, "device_name": device_name}).encode()
        return LoginAnswer(**json.loads(self.sent(address, "/accept", body, REQUEST_SECONDS)))

    def login(self, address: str, request: LoginRequest) -> LoginAnswer:
        return LoginAnswer(**json.loads(self.sent(address, "/login", json.dumps(request.__dict__).encode(), REQUEST_SECONDS)))

    def root_certificate(self, address: str) -> str:
        unchecked = ssl.create_default_context()
        unchecked.check_hostname, unchecked.verify_mode = False, ssl.CERT_NONE
        with urllib.request.urlopen(address + ROOT_CERTIFICATE, timeout=REQUEST_SECONDS, context=unchecked) as answer:
            return answer.read().decode()

    def posted(self, path: str, body: dict) -> bytes:
        return self.sent(self.account.address(), path, json.dumps(body).encode(), REQUEST_SECONDS)

    def acquire_lease(self, name: str) -> Lease:
        return Lease(**json.loads(self.posted("/leases/take", {"name": name})))

    def release_lease(self, name: str) -> Lease:
        return Lease(**json.loads(self.posted("/leases/release", {"name": name})))

    def lease_state(self, name: str) -> Lease:
        return Lease(**json.loads(self.sent(self.account.address(), f"/leases?name={name}", None, REQUEST_SECONDS)))

    def upload_file(self, place: FilePlace, data: bytes) -> None:
        self.sent(self.account.address(), f"/files/{place.address()}", data, COPY_SECONDS)

    def fetch_file(self, place: FilePlace) -> bytes:
        return self.sent(self.account.address(), f"/files/{place.address()}", None, COPY_SECONDS)

    def sent(self, address: str, path: str, body: bytes | None, seconds: float) -> bytes:
        headers = {"Content-Type": "application/json", "Authorization": f"Bearer {self.account.token()}", PROTOCOL_HEADER: str(PROTOCOL), MIGRATION_HEADER: str(self.schema.version()), VERSION_HEADER: VERSION}
        request = urllib.request.Request(address + path, data=body, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=seconds, context=self.trust()) as answer:
                self.checked(answer.headers)
                return answer.read()
        except urllib.error.HTTPError as refused:
            raise TeamRefusal(json.loads(refused.read() or b"{}").get("error", f"the team server answered {refused.code}")) from refused

    @staticmethod
    def checked(headers) -> None:
        server_protocol = int(headers.get(PROTOCOL_HEADER, UNVERSIONED))
        if server_protocol < PROTOCOL:
            raise TeamRefusal(f"the team server speaks protocol {server_protocol}, older than this journal's {PROTOCOL}: upgrade the team server's image")

    def trust(self) -> ssl.SSLContext:
        root = self.account.root_path()
        return ssl.create_default_context(cafile=str(root)) if root.is_file() else ssl.create_default_context()
