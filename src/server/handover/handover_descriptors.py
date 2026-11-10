from dataclasses import astuple, dataclass

QUEUED_CONNECTIONS = 128
READY_BYTE = b"1"


@dataclass(frozen=True)
class HandoverDescriptors:
    """The open files a server hands the server that replaces it: both listening sockets, so a client that
    connects meanwhile waits in the queue of the socket; the lock, which stays held; a pipe the new server
    writes one byte to once it has proved itself; and a pipe that ends when the old server has exited."""

    journal_socket: int
    viewer_socket: int
    lock: int
    ready_pipe: int
    exit_pipe: int

    @classmethod
    def parsed(cls, text: str) -> "HandoverDescriptors":
        return cls(*(int(number) for number in text.split(",")))

    @property
    def text(self) -> str:
        return ",".join(str(descriptor) for descriptor in astuple(self))
