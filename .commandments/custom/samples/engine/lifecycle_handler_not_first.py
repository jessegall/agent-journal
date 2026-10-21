from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.engine.support.typist import Typist
from journal.events.agent.ticked import Ticked


@dataclass(frozen=True)
class Napping(BaseState):
    name = "napping"

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return self.unchanged()

    def on_enter(self, typist: Typist) -> None:
        typist.pause()

    def on_exit(self, typist: Typist) -> None:
        typist.resume()


# @righteous LifecycleHandlerNotFirstDetector
@dataclass(frozen=True)
class Resting(BaseState):
    name = "resting"

    def on_enter(self, typist: Typist) -> None:
        typist.pause()

    def on_exit(self, typist: Typist) -> None:
        typist.resume()

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return self.unchanged()
