class ServerStoppingError(Exception):
    """The server stopped while a command waited for a plugin script."""

    @classmethod
    def plugin_wait(cls, plugin: str, key: str) -> "ServerStoppingError":
        return cls(f"the server stopped before plugin {plugin} answered at {key}, so nothing was written")

    @classmethod
    def judge_run(cls, plugin: str, process_id: int) -> "ServerStoppingError":
        return cls(f"the journal restarted while plugin {plugin}'s judge run {process_id} waited, so nothing was written: run the command again")
