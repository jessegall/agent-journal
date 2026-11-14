import selectors
import socket
import threading
from socketserver import BaseRequestHandler, UnixStreamServer
from server.handover.handover_descriptors import QUEUED_CONNECTIONS
from server.context.server_context import ServerContext
from server.work.tracked_requests import TrackedRequests


class JournalServer(TrackedRequests, UnixStreamServer):
    """The server on the journal's socket: one daemon thread per request, kept so a stop waits for them up to
    its limit, and a loop that sleeps on its socket and a wake socket, so a stop returns at once. A client
    that left before its answer is no error."""

    request_queue_size = QUEUED_CONNECTIONS

    def __init__(self, path: str, handler: type[BaseRequestHandler], context: ServerContext, inherited_socket: socket.socket | None = None) -> None:
        self.context = context
        self.wake_sender, self.wake_receiver = socket.socketpair()
        self.stopping, self.stopped = threading.Event(), threading.Event()
        self.is_handing_over = False
        super().__init__(path, handler, inherited_socket=inherited_socket)

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

    def request_stop(self) -> None:
        self.stopping.set()
        self.wake_sender.send(b"\0")

    def begin_handover(self) -> None:
        self.context.files.mark_restart()
        self.is_handing_over = True
        self.request_stop()

    def release_files(self) -> None:
        self.context.files.remove_server_files()
        self.context.files.release_lock()
        self.request_stop()

    def server_close(self) -> None:
        super().server_close()
        self.wake_sender.close()
        self.wake_receiver.close()
