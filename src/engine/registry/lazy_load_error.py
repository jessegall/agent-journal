class LazyLoadError(RuntimeError):
    """The engine loaded at use something that must be loaded whole when the journal loads, while lazy loading is
    prevented."""
