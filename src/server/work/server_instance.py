from typing import TypeVar

S = TypeVar("S")


def server_instance(server: object, server_type: type[S]) -> S:
    if not isinstance(server, server_type):
        raise TypeError(f"this request handler serves a {server_type.__name__}, not {type(server).__name__}")
    return server
