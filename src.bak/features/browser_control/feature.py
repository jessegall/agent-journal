from framework.base import Feature
from framework.journal import Journal
from controllers.types import Asks
from features.browser_control.details import BrowserControlDetails
from features.browser_control.routes import post_driver, post_pending, post_result

__all__ = ["Asks"]


class BrowserControl(Feature):
    details = BrowserControlDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(post_driver, post_pending, post_result)
