from engine.driver.wake_ask import WakeAsk


class WakeRoute:
    """How the journal takes a line a project hook gives its agent from the background: the line waits for the
    agent and is typed into its terminal once it stops. With no drivers module installed, the line is dropped."""

    def line(self, ask: WakeAsk, hook: str, text: str) -> bool:
        return False
