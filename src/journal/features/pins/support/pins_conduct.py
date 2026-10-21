import re

from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.turn_displayed import TurnDisplayed
from journal.features.pins.support.pins_data import PinsData

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")
LOCAL_ADDRESS_PATTERN = re.compile(r"^https?://(?:localhost|127\.0\.0\.1)[:/]")


class PinsConduct(Conduct):
    """The pins feature's conduct in every state: a link in the agent's words or in a command's output that no pin carries is suggested as a pin, once, and again only after so many tool uses."""

    def on_turn_displayed_pins(self, event: TurnDisplayed, settings: Settings) -> Transition:
        from journal.features.pins.feature import Pins
        return self.unchanged(*suggestions(event.content, event.data.of(Pins))) if event.final else self.unchanged()

    def on_tool_finished_pins(self, event: ToolFinished, settings: Settings) -> Transition:
        from journal.features.pins.feature import Pins
        return self.unchanged() if event.subagent else self.unchanged(*suggestions(event.printed, event.data.of(Pins)))


def suggestions(text: str, pins: PinsData) -> list[Nudge]:
    from journal.features.pins.feature import Pins
    loose = [url.rstrip(".,;:") for url in LINK.findall(text) if not LOCAL_ADDRESS_PATTERN.match(url)]
    fresh = [url for url in dict.fromkeys(loose) if url.rstrip("/") not in pins.pinned and url.rstrip("/") not in pins.suggested_lately]
    return [Pins.LINK_PIN_REQUEST.create(url=url) for url in fresh]
