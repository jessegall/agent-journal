import socket

PROBE_ADDRESS = ("1.1.1.1", 443)
PROBE_LIMIT_SECONDS = 1


class ConnectionProbe:
    """Checks whether a short connection can reach the internet."""

    def is_online(self) -> bool:
        try:
            with socket.create_connection(PROBE_ADDRESS, timeout=PROBE_LIMIT_SECONDS):
                return True
        except OSError:
            return False
