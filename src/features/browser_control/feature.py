from features.base import Feature
from features.browser_control.controller import Asks
from features.browser_control.details import BrowserControlDetails

__all__ = ["Asks"]


class BrowserControl(Feature):
    details = BrowserControlDetails
