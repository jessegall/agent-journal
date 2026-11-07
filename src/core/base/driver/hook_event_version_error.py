from core.base.driver.hook_event_error import HookEventError


class HookEventVersionError(HookEventError):
    """Raised when a hook's body was prepared for a version of the object this server does not read."""
