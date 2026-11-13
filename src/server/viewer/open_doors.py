from collections.abc import Mapping, Sequence

from server.viewer.closed_doors import ClosedDoors
from server.enums.closed_service import ClosedService


class OpenDoors(ClosedDoors):
    """The doors of a journal on a user's own machine: none is shut."""

    def closes_route(self, path: str, query: Mapping[str, Sequence[str]]) -> bool:
        return False

    def closes_service(self, service: ClosedService) -> bool:
        return False
