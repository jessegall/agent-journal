import socket
import sys
import threading
import time
from socketserver import TCPServer, ThreadingMixIn
from typing import Any

from server.work.client_disconnected import client_disconnected

DRAIN_POLL_SECONDS = 0.05


class TrackedRequests(ThreadingMixIn, TCPServer):
    """A socket server's requests, each on a daemon thread of its own and kept, so a stop waits for them up to its
    limit. The server binds its address, or takes the listening socket of the server it replaces, with the
    connections that wait in it."""

    daemon_threads = True

    def __init__(self, *arguments: Any, inherited_socket: socket.socket | None = None, **options: Any) -> None:
        self.request_threads: set[threading.Thread] = set()
        self.idle_connections: dict[threading.Thread, socket.socket] = {}
        self.thread_lock = threading.Lock()
        self.inherited_socket = inherited_socket
        super().__init__(*arguments, **options)

    def handle_error(self, request: Any, client_address: Any) -> None:
        if not client_disconnected(sys.exception()):
            super().handle_error(request, client_address)

    def server_bind(self) -> None:
        if self.inherited_socket is None:
            super().server_bind()
            return
        self.socket.close()
        self.socket = self.inherited_socket
        self.server_address = self.socket.getsockname()

    def process_request(self, request: Any, client_address: Any) -> None:
        thread = threading.Thread(target=self.tracked_request, args=(request, client_address), daemon=True)
        with self.thread_lock:
            self.request_threads.add(thread)
        thread.start()

    def tracked_request(self, request: Any, client_address: Any) -> None:
        try:
            self.process_request_thread(request, client_address)
        finally:
            self.untrack_request()

    def untrack_request(self) -> None:
        with self.thread_lock:
            self.request_threads.discard(threading.current_thread())
            self.idle_connections.pop(threading.current_thread(), None)

    def connection_idle(self, connection: socket.socket) -> None:
        with self.thread_lock:
            self.idle_connections[threading.current_thread()] = connection

    def connection_busy(self) -> None:
        with self.thread_lock:
            self.idle_connections.pop(threading.current_thread(), None)

    # Waits for the requests that run, up to the limit; a connection kept open with no request on it is closed
    # from this side at once, as it would otherwise hold the stop until its client let go.
    def drain(self, limit_seconds: float) -> None:
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
