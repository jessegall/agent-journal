from engine.driver.wake_ask import WakeAsk
from engine.driver.wake_reply import WakeReply


class WakeRoute:
    """How the journal answers an agent program's wake hook, in two steps: answer registers the waiter on the
    database and gives a line already waiting, waited then waits for one with no database held. With no
    drivers module installed, every wake is gone."""

    def answer(self, ask: WakeAsk) -> WakeReply:
        return WakeReply.gone()

    def waited(self, waiting: WakeReply, seconds: float) -> WakeReply:
        return WakeReply.gone()

    def received(self, line_id: int, token: str) -> bool:
        return False

    def line(self, ask: WakeAsk, hook: str, text: str) -> bool:
        return False

    def live_waiters(self) -> int:
        return 0
