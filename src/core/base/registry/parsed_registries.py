import threading
from collections import OrderedDict
from collections.abc import Callable
from typing import TYPE_CHECKING

from core.base.registry.lazy_loading import LazyLoading

if TYPE_CHECKING:
    from core.base.registry.registry import Registry


class ParsedRegistries:
    """The registries this process built, one per content and the most recently used kept, shared by every journal
    with the same rows. The lazy-load guard hears of each one that is dropped, so building it again later is a
    rebuild after eviction, not a second load of a registry still in use."""

    def __init__(self, most: int) -> None:
        self.most = most
        self.registries: OrderedDict[tuple[str, str], "Registry"] = OrderedDict()
        self.lock = threading.Lock()

    def kept(self, content: tuple[str, str], build: Callable[[], "Registry"]) -> "Registry":
        with self.lock:
            if content in self.registries:
                self.registries.move_to_end(content)
                return self.registries[content]
            LazyLoading.registry_built(hash(content))
            registry = build()
            self.registries[content] = registry
            if len(self.registries) > self.most:
                dropped, _ = self.registries.popitem(last=False)
                LazyLoading.registry_dropped(hash(dropped))
            return registry
