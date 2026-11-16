from engine.driver.wake_request import WakeRequest


class WakeRoute:
    """How the journal takes a line a project hook gives its agent from the background: the line waits for the
    agent and is typed into its terminal once it stops. With no drivers module installed, the line is dropped."""

    def line(self, ask: WakeRequest, hook: str, text: str) -> bool:
        return False
