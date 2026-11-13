class ListenerRebuiltError(Exception):
    """Raised when a thread builds its commit listeners a second time for a registry whose listener set it still
    holds."""

    def __init__(self, thread_name: str, fingerprint: str) -> None:
        super().__init__(f"the {thread_name} thread built its listeners a second time for registry {fingerprint}")
        self.thread_name, self.fingerprint = thread_name, fingerprint
