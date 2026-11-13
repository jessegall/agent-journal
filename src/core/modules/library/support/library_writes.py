from collections.abc import Callable, Mapping
from typing import TypeVar

from engine.errors.refusal import Refusal
from core.modules.library.support.library_client import LibraryClient
from engine.library.library_item import LibraryItem
from core.modules.library.errors.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.version_request import VersionRequest

T = TypeVar("T")


class LibraryWrites:
    """Sends a user's changes to the shared server as they are made: a new item, a removal, a removed item brought
    back, and an old version put in again as a new one; an unreachable server is a refusal naming its address."""

    def __init__(self, client: LibraryClient) -> None:
        self.client = client

    def new_item(self, share: str, fields: Mapping[str, object]) -> LibraryItem:
        return self.reached(lambda: self.client.new_item(share, fields))

    def remove(self, share: str, item_id: int) -> LibraryItem:
        return self.reached(lambda: self.client.removal(share, item_id))

    def restore_removed(self, share: str, item_id: int) -> LibraryItem:
        return self.reached(lambda: self.restore_if_removed(share, item_id))

    def restore_version(self, request: VersionRequest) -> LibraryItem:
        return self.reached(lambda: self.copy_old_version(request))

    def restore_if_removed(self, share: str, item_id: int) -> LibraryItem:
        if not self.client.item(share, item_id).is_removed:
            raise Refusal(f"library {share} {item_id} is not removed", f"give --version <n> to bring an old version back: journal library versions {share} {item_id} lists them")
        return self.client.restoration(share, item_id)

    def copy_old_version(self, request: VersionRequest) -> LibraryItem:
        old, current = self.client.old_version(request), self.client.item(request.share, request.item_id)
        newest = self.client.restoration(request.share, request.item_id) if current.is_removed else current
        return self.client.update(request.share, request.item_id, newest.version, old.fields)

    def reached(self, request: Callable[[], T]) -> T:
        try:
            return request()
        except LibraryUnreachableError as unreachable:
            raise unreachable.address_refusal(self.client.connected_address()) from unreachable
