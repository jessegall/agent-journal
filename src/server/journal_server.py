import selectors
import socket
import threading
import time
from dataclasses import dataclass
from socketserver import BaseRequestHandler, ThreadingMixIn, UnixStreamServer
from typing import Any

from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from server.code_version import CodeVersion
from server.listener_thread import ListenerThread
from server.server_files import ServerFiles

DRAIN_LIMIT_SECONDS = 10


@dataclass(frozen=True)
class ServerContext:
    """What every request of one server shares: the journal's folder, the code the server started with, its
    files, when it started, and its listener thread."""

    home: JournalHome
    code_version: CodeVersion
    files: ServerFiles
    started_at: Timestamp
    listener_thread: ListenerThread


class JournalServer(ThreadingMixIn, UnixStreamServer):
    """The server on the journal's socket: one daemon thread per request, kept so a stop waits for them up to its
    limit, and a loop that sleeps on its socket and a wake socket, so a stop returns at once."""

    daemon_threads = True

    def __init__(self, path: str, handler: type[BaseRequestHandler], context: ServerContext) -> None:
        self.context = context
        self.wake_sender, self.wake_receiver = socket.socketpair()
        self.stopping, self.stopped = threading.Event(), threading.Event()
        self.request_threads: set[threading.Thread] = set()
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

    def request_stop(self) -> None:
        self.stopping.set()
        self.wake_sender.send(b"\0")

    def release_files(self) -> None:
        self.context.files.remove_server_files()
        self.context.files.release_lock()
        self.request_stop()

    def drain(self, limit_seconds: float) -> None:
        deadline = time.monotonic() + limit_seconds
        with self.thread_lock:
            threads = [thread for thread in self.request_threads if thread is not threading.current_thread()]
        for thread in threads:
            thread.join(max(0.0, deadline - time.monotonic()))

    def server_close(self) -> None:
        super().server_close()
        self.wake_sender.close()
        self.wake_receiver.close()
