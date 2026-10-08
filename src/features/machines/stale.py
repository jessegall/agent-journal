from controllers.base import PRESSED, Pressed
from resources.base import Resource, Stale


class StaleWrites:
    """Refuses a press on a row that changed after the person pressing it last saw it."""

    def __call__(self, controller, r: Resource) -> None:
        pressed = PRESSED.get()
        if not pressed.is_row(controller.type, r.n):
            return
        PRESSED.set(Pressed())
        if controller.load(r.n).updated != pressed.updated:
            raise Stale(f"{controller.type} {r.n} changed after you last saw it; look at it again before you change it")
