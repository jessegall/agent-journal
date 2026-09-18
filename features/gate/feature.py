from controllers.types import CONTROLLERS
from features.base import Feature, on
from resources.base import SYSTEM


class Gate(Feature):
    name = "gate"
    title_ = "The write gate"
    abstract_ = "A write is refused while no work is open; the flag the hook reads is set here"
    help_ = "Declare work before the first write; reads are never refused."

    def open_work(self, record) -> bool:
        return any(not w.completed for w in CONTROLLERS["work"](record, actor=SYSTEM).all())

    @on("work")
    def on_work(self, event, record) -> None:
        if self.open_work(record):
            self.release(record)
        else:
            self.hold(record, "nothing is open, so this write would not be filed: journal work start \"<the work>\" first")

    @on("agent.created")
    def on_agent(self, event, record) -> None:
        self.on_work(event, record)
