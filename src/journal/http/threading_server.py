import selectors
import socket
import threading
from http.server import ThreadingHTTPServer


class ThreadingServer(ThreadingHTTPServer):
    """A threading HTTP server whose loop sleeps on its socket and a wake socket, never on a poll, so a shutdown returns at once."""

    daemon_threads = True

    def __init__(self, address: tuple[str, int], handler: type) -> None:
        self._wake, self._woken = socket.socketpair()
        self._stopping, self._stopped = threading.Event(), threading.Event()
        super().__init__(address, handler)

    def serve_forever(self) -> None:
        try:
            self.serve()
        finally:
            self._stopped.set()

    def serve(self) -> None:
        with selectors.DefaultSelector() as selector:
            selector.register(self, selectors.EVENT_READ)
            selector.register(self._woken, selectors.EVENT_READ)
            while not self._stopping.is_set():
                if any(key.fileobj is self for key, _ in selector.select()) and not self._stopping.is_set():
                    self._handle_request_noblock()

    def shutdown(self) -> None:
        self._stopping.set()
        self._wake.send(b"\0")
        self._stopped.wait()

    def server_close(self) -> None:
        super().server_close()
        self._wake.close()
        self._woken.close()
