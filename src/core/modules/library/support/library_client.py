import http.client
import json
import urllib.error
import urllib.parse
import urllib.request
from collections.abc import Callable, Mapping
from types import MappingProxyType
from typing import TypeVar

from core.base.private.secret_values import SecretValues
from engine.errors.refusal import Refusal
from core.modules.library.support.library_certificate import LibraryCertificate
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.library_address import ADDRESS_SETTING, LibraryAddress
from core.modules.library.support.library_failures import LibraryFailures
from core.base.library.library_item import LibraryItem
from core.modules.library.support.library_item_body import LibraryItemBody
from core.modules.library.support.library_page import LibraryPage
from core.modules.library.support.page_request import PageRequest
from core.modules.library.support.version_request import VersionRequest
from core.modules.library.support.library_versions import LibraryVersions
from core.modules.library.support.library_unchanged_error import LibraryUnchangedError
from core.modules.library.support.library_stopped_error import LibraryStoppedError
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.library_token import LibraryToken
from core.modules.library.support.library_tokens import LibraryTokens
from core.modules.library.support.library_user import LibraryUser
from core.modules.library.support.library_users import LibraryUsers
from core.modules.library.support.new_library_user import NewLibraryUser
from core.modules.library.support.server_state import ServerState
from core.modules.settings.bindings.support.setting_values import SettingValues

LIMIT_SECONDS = 5
PROTOCOL = "1"
UNCHANGED_CODE = 304
TOKEN_VARIABLE = "JOURNAL_LIBRARY_TOKEN"
EMPTY_HEADERS: Mapping[str, str] = MappingProxyType({})

T = TypeVar("T")


class LibraryClient:
    """Sends one request to the shared server, only to the address a person connected to, and turns the answer into
    a value or one of the failures in library_failures. It has no retries: the next round is the retry."""

    def __init__(self, settings: SettingValues, values: SecretValues, connections: LibraryConnectionQuery, certificate: LibraryCertificate) -> None:
        self.settings, self.values, self.connections, self.certificate = settings, values, connections, certificate

    @property
    def is_connected(self) -> bool:
        connection = self.connections.current()
        return connection is not None and not connection.stopped and TOKEN_VARIABLE in self.values.values()

    def state(self) -> ServerState:
        return self.send(ServerState.parsed, "GET", "/state")

    def newest_state(self, kept: ServerState) -> ServerState:
        try:
            return self.send(ServerState.parsed, "GET", "/state", headers={"If-None-Match": f'"{kept.etag}"'})
        except LibraryUnchangedError:
            return kept

    def item(self, share: str, item_id: int) -> LibraryItem:
        return self.send(LibraryItemBody.parsed, "GET", f"/items/{share}/{item_id}")

    def page(self, request: PageRequest, limit_seconds: float = LIMIT_SECONDS) -> LibraryPage:
        query = urllib.parse.urlencode({"kind": request.share, "search": request.search, "page": request.number})
        return self.send(LibraryPage.parsed, "GET", f"/items?{query}", limit_seconds=limit_seconds)

    def versions(self, share: str, item_id: int) -> LibraryVersions:
        return self.send(LibraryVersions.parsed, "GET", f"/items/{share}/{item_id}/versions")

    def new_item(self, share: str, fields: Mapping[str, object]) -> LibraryItem:
        return self.send(LibraryItemBody.parsed, "POST", f"/items/{share}", {"fields": fields})

    def old_version(self, request: VersionRequest) -> LibraryItem:
        return self.send(LibraryItemBody.parsed, "GET", f"/items/{request.share}/{request.item_id}/versions/{request.version}")

    def removal(self, share: str, item_id: int) -> LibraryItem:
        return self.send(LibraryItemBody.parsed, "DELETE", f"/items/{share}/{item_id}")

    def restoration(self, share: str, item_id: int) -> LibraryItem:
        return self.send(LibraryItemBody.parsed, "POST", f"/items/{share}/{item_id}/restore")

    def update(self, share: str, item_id: int, base_version: int, fields: Mapping[str, object]) -> LibraryItem:
        return self.send(LibraryItemBody.parsed, "PUT", f"/items/{share}/{item_id}", {"fields": fields}, {"If-Match": f'"{base_version}"'})

    def users(self) -> LibraryUsers:
        return self.send(LibraryUsers.parsed, "GET", "/users")

    def tokens(self, user_id: int) -> LibraryTokens:
        return self.send(LibraryTokens.parsed, "GET", f"/users/{user_id}/tokens")

    def new_user(self, name: str, role: LibraryRole) -> NewLibraryUser:
        return self.send(NewLibraryUser.parsed, "POST", "/users", {"name": name, "role": role.value})

    def changed_user(self, user_id: int, role: LibraryRole) -> LibraryUser:
        return self.send(LibraryUser.answered, "PATCH", f"/users/{user_id}", {"role": role.value})

    def removed_user(self, user_id: int) -> LibraryUser:
        return self.send(LibraryUser.answered, "DELETE", f"/users/{user_id}")

    def revoked_token(self, token_id: int) -> LibraryToken:
        return self.send(LibraryToken.answered, "DELETE", f"/tokens/{token_id}")

    def send(self, parse: Callable[[object], T], method: str, path: str, body: Mapping[str, object] | None = None, headers: Mapping[str, str] = EMPTY_HEADERS,
             limit_seconds: float = LIMIT_SECONDS) -> T:
        return self.call(self.connected_address(), self.token(), parse, method, path, body, headers, limit_seconds, opener=self.certificate.opener())

    def call(self, address: str, token: str, parse: Callable[[object], T], method: str, path: str, body: Mapping[str, object] | None = None,
             headers: Mapping[str, str] = EMPTY_HEADERS, limit_seconds: float = LIMIT_SECONDS, *, opener: urllib.request.OpenerDirector) -> T:
        request = urllib.request.Request(address + path, data=None if body is None else json.dumps(body).encode(), method=method,
                                         headers={"Authorization": f"Bearer {token}", "Journal-Protocol": PROTOCOL, "Content-Type": "application/json", **headers})
        try:
            with opener.open(request, timeout=limit_seconds) as answer:
                return parse(json.load(answer))
        except urllib.error.HTTPError as failure:
            if failure.code == UNCHANGED_CODE:
                raise LibraryUnchangedError("the server has nothing newer") from failure
            raise LibraryFailures.classify(failure.code, failure.read()) from failure
        except (urllib.error.URLError, http.client.HTTPException, OSError, ValueError) as failure:
            raise LibraryUnreachableError(str(failure)) from failure

    def connected_address(self) -> str:
        connection = self.connections.current()
        if connection is None:
            raise LibraryStoppedError.disconnected()
        if connection.stopped:
            raise LibraryStoppedError(connection.stopped)
        try:
            current = LibraryAddress(str(self.settings.project_value(ADDRESS_SETTING))).base
        except Refusal as invalid:
            raise LibraryStoppedError.address_changed() from invalid
        if current != connection.address:
            raise LibraryStoppedError.address_changed()
        return connection.address

    def token(self) -> str:
        values = self.values.values()
        if TOKEN_VARIABLE not in values:
            raise LibraryStoppedError.disconnected()
        return values[TOKEN_VARIABLE]
