from dataclasses import dataclass


@dataclass(frozen=True)
class PageLayout:
    """A suite's default layout of one viewer page under one driver, as the layout shape the viewer arranges."""

    suite: str
    page: str
    driver: str
    shape: object
