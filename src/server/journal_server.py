import selectors
import socket
import threading
import time
from socketserver import BaseRequestHandler, ThreadingMixIn, UnixStreamServer
from typing import Any
from server.server_context import ServerContext


DRAIN_LIMIT_SECONDS = 10
DRAIN_POLL_SECONDS = 0.05
class JournalServer(ThreadingMixIn, UnixStreamServer):
    """The server on the journal's socket: one daemon thread per request, kept so a stop waits for them up to its
    limit, and a loop that sleeps on its socket and a wake socket, so a stop returns at once."""

    daemon_threads = True

    def __init__(self, path: str, handler: type[BaseRequestHandler], context: ServerContext) -> None:
        self.context = context
        self.wake_sender, self.wake_receiver = socket.socketpair()
        self.stopping, self.stopped = threading.Event(), threading.Event()
        self.request_threads: set[threading.Thread] = set()
        self.idle_connections: dict[threading.Thread, socket.socket] = {}
        self.thread_lock = threading.Lock()
        super().__init__(path, handler)

    def serve_requests(self) -> None:
        try:
            with selectors.DefaultSelector() as selector:
                selector.register(self, selectors.EVENT_READ)
                selector.register(self.wake_receiver, selectors.EVENT_READ)
                while not self.stopping.is_set():
                    if any(key.fileobj is self for key, _ in selector.select()) and not self.stopping.is_set():
                        self.handle_request()
        finally:
            self.stopped.set()

    def process_request(self, request: Any, client_address: Any) -> None:
        thread = threading.Thread(target=self.tracked_request, args=(request, client_address), daemon=True)
        with self.thread_lock:
            self.request_threads.add(thread)
        thread.start()

    def tracked_request(self, request: Any, client_address: Any) -> None:
        try:
            self.process_request_thread(request, client_address)
        finally:
            with self.thread_lock:
                self.request_threads.discard(threading.current_thread())
                self.idle_connections.pop(threading.current_thread(), None)

    def connection_idle(self, connection: socket.socket) -> None:
        with self.thread_lock:
            self.idle_connections[threading.current_thread()] = connection

    def connection_busy(self) -> None:
        with self.thread_lock:
            self.idle_connections.pop(threading.current_thread(), None)

    def request_stop(self) -> None:
        self.stopping.set()
        self.wake_sender.send(b"\0")

    def release_files(self) -> None:
        self.context.files.remove_server_files()
        self.context.files.release_lock()
        self.request_stop()

    def drain(self, limit_seconds: float) -> None:
        """Waits for the requests that run, up to the limit; a connection kept open with no request on it is closed
        from this side at once, as it would otherwise hold the stop until its client let go."""
        deadline = time.monotonic() + limit_seconds
        while time.monotonic() < deadline:
            with self.thread_lock:
                threads = [thread for thread in self.request_threads if thread is not threading.current_thread()]
                idle = list(self.idle_connections.values())
            if not threads:
                return
            for connection in idle:
                try:
                    connection.shutdown(socket.SHUT_RD)
                except OSError:
                    continue
            threads[0].join(DRAIN_POLL_SECONDS)

    def server_close(self) -> None:
        super().server_close()
        self.wake_sender.close()
        self.wake_receiver.close()
