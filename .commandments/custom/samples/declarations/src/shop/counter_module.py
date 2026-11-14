from engine.module.module import Module
from engine.viewer.window_declaration import WindowDeclaration


# @righteous architecture_modules_unlisted_declaration
class CounterWindow(WindowDeclaration):
    """The counter module lists it."""


class CounterModule(Module):
    name = "counter"
    windows = [CounterWindow]
