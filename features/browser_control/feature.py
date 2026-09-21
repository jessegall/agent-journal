from features.base import Feature
from features.browser_control.controller import Asks
from features.browser_control.details import BrowserDetails

__all__ = ["Asks"]


class Browser(Feature):
    details = BrowserDetails
