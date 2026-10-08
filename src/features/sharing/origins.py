import socket
import time
from collections.abc import Callable
from ipaddress import IPv4Address, IPv6Address, ip_address, ip_network

from engine.extension import Extension
from engine.record import Record

LOCAL = ("127.0.0.1", "localhost")
LOOKUP_EVERY = 60
ORIGINS = Extension()

Clock = Callable[[], float]


def local(host: str) -> bool:
    return host.split(":", 1)[0] in LOCAL


def own_origin(host: str, encrypted: bool) -> str:
    """The origin this server's own pages load from: https behind a TLS proxy or a tunnel, plain http only on the machine itself."""
    return f"{'https' if encrypted else 'http'}://{host}"


class Origins:
    """Where a request to the share server came from, told by its Host header as the tunnel on this machine forwards it."""

    def peer(self, handler) -> IPv4Address | IPv6Address:
        return ip_address(handler.client_address[0])

    def on_this_machine(self, handler) -> bool:
        return local(handler.headers.get("Host", ""))

    def encrypted(self, handler) -> bool:
        return handler.headers.get("X-Forwarded-Proto") == "https" or not self.on_this_machine(handler)

    def client(self, handler) -> IPv4Address | IPv6Address:
        return self.peer(handler)

    def origin(self, handler) -> str:
        return own_origin(handler.headers.get("Host", ""), self.encrypted(handler))

    def place(self, handler) -> str:
        """Where a try comes from, with an IPv6 client counted by its /64 network."""
        address = self.client(handler)
        return str(ip_network(f"{address}/64", strict=False)) if address.version == 6 else str(address)


class ProxyLookup:
    """The addresses a proxy's name has, looked up again once a minute; a name that does not resolve is trusted by no one."""

    def __init__(self, clock: Clock = time.time) -> None:
        self.clock = clock
        self.found: dict[str, tuple[float, frozenset[str]]] = {}

    def of(self, name: str) -> frozenset[str]:
        at, found = self.found.get(name, (0.0, frozenset()))
        if not name or self.clock() - at < LOOKUP_EVERY:
            return found
        try:
            found = frozenset(socket.gethostbyname_ex(name)[2])
        except OSError:
            found = frozenset()
        self.found[name] = (self.clock(), found)
        return found


class ProxyOrigins(Origins):
    """Where a request came from when a named TLS proxy stands in front: only that proxy may say it came over https and from whom."""

    def __init__(self, proxy: str, lookup: ProxyLookup) -> None:
        self.proxy = proxy
        self.lookup = lookup

    def proxied(self, handler) -> bool:
        return str(self.peer(handler)) in self.lookup.of(self.proxy) and "X-Forwarded-For" in handler.headers

    def on_this_machine(self, handler) -> bool:
        return self.peer(handler).is_loopback and not self.proxied(handler)

    def encrypted(self, handler) -> bool:
        return self.proxied(handler) and handler.headers.get("X-Forwarded-Proto") == "https"

    def client(self, handler) -> IPv4Address | IPv6Address:
        if not self.proxied(handler):
            return self.peer(handler)
        return ip_address(handler.headers["X-Forwarded-For"].rsplit(",", 1)[-1].strip())


def origins_of(record: Record) -> Origins:
    """How this journal's share server tells where a request came from: as a feature names it, or else by the tunnel's Host."""
    named = [given(record) for given in ORIGINS.each(record)]
    return named[-1] if named else Origins()
