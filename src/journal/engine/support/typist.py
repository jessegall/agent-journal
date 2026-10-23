PAUSE = "pause"
RESUME = "resume"
DISABLE = "disable"
ENABLE = "enable"
CLEAR = "clear"


class Typist:
    """The moves a state asks of its environment's terminal as it enters or leaves the stack, gathered in order for the delivery to make: pause queues every line until resume types them as one, disable drops every line until enable, clear empties the queue."""

    def __init__(self) -> None:
        self.moves: list[str] = []

    def pause(self) -> None:
        self.moves.append(PAUSE)

    def resume(self) -> None:
        self.moves.append(RESUME)

    def disable(self) -> None:
        self.moves.append(DISABLE)

    def enable(self) -> None:
        self.moves.append(ENABLE)

    def clear(self) -> None:
        self.moves.append(CLEAR)
