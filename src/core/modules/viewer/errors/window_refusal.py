from engine.errors.refusal import Refusal


class WindowRefusal(Refusal):
    """Raised when a window may not run a command line for the user at the viewer."""
