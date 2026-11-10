from dataclasses import dataclass

from server.enums.route_audience import RouteAudience


@dataclass(frozen=True)
class ViewerRouteRule:
    """One route of the viewer, or of the journal's own socket, and who may reach it; a prefix covers every path
    below it."""

    path: str
    method: str
    audience: RouteAudience
    is_prefix: bool = False

    @property
    def example_path(self) -> str:
        return f"{self.path}example" if self.is_prefix else self.path
