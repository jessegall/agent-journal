from features.base import Feature
from features.journal import Journal
from features.browser_control.controller import Asks
from features.browser_control.details import BrowserControlDetails
from features.browser_control.routes import post_driver, post_pending, post_result

__all__ = ["Asks"]


class BrowserControl(Feature):
    details = BrowserControlDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(post_driver, post_pending, post_result)
