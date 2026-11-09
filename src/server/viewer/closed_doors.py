from collections.abc import Mapping, Sequence

from server.viewer.closed_service import ClosedService


class ClosedDoors:
    """The routes and server parts a journal keeps shut."""

    def closes_route(self, path: str, query: Mapping[str, Sequence[str]]) -> bool:
        raise NotImplementedError

    def closes_service(self, service: ClosedService) -> bool:
        raise NotImplementedError
