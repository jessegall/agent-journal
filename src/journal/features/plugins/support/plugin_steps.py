from contextlib import contextmanager
from contextvars import ContextVar
from typing import Iterator

_steps: ContextVar[int] = ContextVar("plugin_steps", default=0)


class PluginSteps:
    """How many plugin commands led to the work in hand: a plugin's command runs a step deeper, and a row written past one step is heard by no plugin, so two plugins never answer each other forever."""

    LIMIT = 1

    def too_deep(self) -> bool:
        return _steps.get() > self.LIMIT

    @contextmanager
    def deeper(self) -> Iterator[None]:
        token = _steps.set(_steps.get() + 1)
        try:
            yield
        finally:
            _steps.reset(token)
