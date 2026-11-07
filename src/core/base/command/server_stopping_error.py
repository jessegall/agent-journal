class ServerStoppingError(Exception):
    """The server stopped while a command waited for a plugin script."""

    @classmethod
    def plugin_wait(cls, plugin: str, key: str) -> "ServerStoppingError":
        return cls(f"the server stopped before plugin {plugin} answered at {key}, so nothing was written")
