from core.base.registry.lazy_load_error import LazyLoadError


class LazyLoading:
    """Whether this process stops at once on a lazy load: the engine loads its registry with its whole event
    lookup when a journal loads and shares it, so a second build of the same registry is a fault (an event
    the registry did not scan is refused on its own, by UnscannedEventError). The developer setting Prevent
    lazy loading turns it on for each request; the stories set it always on, whatever a story's settings
    say."""

    prevented = False
    disabled = False
    built_registries: set[int] = set()

    @classmethod
    def refuse(cls, subject: str) -> None:
        if cls.prevented or cls.disabled:
            raise LazyLoadError(f"lazy load: {subject}; load it whole when the journal loads and share it")

    @classmethod
    def registry_built(cls, content: int) -> None:
        if content in cls.built_registries:
            cls.refuse("a registry was built again from rows already built in this process")
        cls.built_registries.add(content)

    @classmethod
    def registry_dropped(cls, content: int) -> None:
        cls.built_registries.discard(content)
