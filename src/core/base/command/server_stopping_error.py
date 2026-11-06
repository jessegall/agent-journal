class ServerStoppingError(Exception):
    """The server stopped while a command waited on a plugin's script. The transaction was over by then, so nothing was
    written."""

    @classmethod
    def before(cls, plugin: str, key: str) -> "ServerStoppingError":
        return cls(f"the server stopped before plugin {plugin} answered at {key}, so nothing was written")
