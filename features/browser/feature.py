from features.base import Feature
from features.browser.controller import Asks
from features.browser.details import BrowserDetails

__all__ = ["Asks"]


class Browser(Feature):
    details = BrowserDetails
