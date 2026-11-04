import http.client
import json
import urllib.error
import urllib.request
from collections.abc import Callable, Mapping
from types import MappingProxyType
from typing import TypeVar

from core.base.private.secret_values import SecretValues
from core.base.refusal import Refusal
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.library_address import ADDRESS_SETTING, LibraryAddress
from core.modules.library.support.library_errors import LibraryFailures
from core.modules.library.support.library_item import LibraryItem
from core.modules.library.support.library_unchanged_error import LibraryUnchangedError
from core.modules.library.support.library_stopped import LibraryStopped
from core.modules.library.support.library_unreachable import LibraryUnreachable
from core.modules.library.support.no_redirects import NoRedirects
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
    a value or one of the failures in library_errors. It has no retries: the next round is the retry."""

    def __init__(self, settings: SettingValues, values: SecretValues, connections: LibraryConnectionQuery) -> None:
        self.settings, self.values, self.connections = settings, values, connections
        self.opener = urllib.request.build_opener(NoRedirects)

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
        return self.send(LibraryItem.parsed, "GET", f"/items/{share}/{item_id}")

    def update(self, share: str, item_id: int, base_version: int, fields: Mapping[str, object]) -> LibraryItem:
        return self.send(LibraryItem.parsed, "PUT", f"/items/{share}/{item_id}", {"fields": fields}, {"If-Match": f'"{base_version}"'})

    def send(self, parse: Callable[[object], T], method: str, path: str, body: Mapping[str, object] | None = None, headers: Mapping[str, str] = EMPTY_HEADERS) -> T:
        return self.call(self.connected_address(), self.token(), parse, method, path, body, headers)

    def call(self, address: str, token: str, parse: Callable[[object], T], method: str, path: str, body: Mapping[str, object] | None = None,
             headers: Mapping[str, str] = EMPTY_HEADERS) -> T:
        request = urllib.request.Request(address + path, data=None if body is None else json.dumps(body).encode(), method=method,
                                         headers={"Authorization": f"Bearer {token}", "Journal-Protocol": PROTOCOL, "Content-Type": "application/json", **headers})
        try:
            with self.opener.open(request, timeout=LIMIT_SECONDS) as answer:
                return parse(json.load(answer))
        except urllib.error.HTTPError as failure:
            if failure.code == UNCHANGED_CODE:
                raise LibraryUnchangedError("the server has nothing newer") from failure
            raise LibraryFailures.classify(failure.code, failure.read()) from failure
        except (urllib.error.URLError, http.client.HTTPException, OSError, ValueError) as failure:
            raise LibraryUnreachable(str(failure)) from failure

    def connected_address(self) -> str:
        connection = self.connections.current()
        if connection is None:
            raise LibraryStopped.disconnected()
        try:
            current = LibraryAddress(str(self.settings.project_value(ADDRESS_SETTING))).base
        except Refusal as invalid:
            raise LibraryStopped.address_changed() from invalid
        if current != connection.address:
            raise LibraryStopped.address_changed()
        return connection.address

    def token(self) -> str:
        values = self.values.values()
        if TOKEN_VARIABLE not in values:
            raise LibraryStopped.disconnected()
        return values[TOKEN_VARIABLE]
