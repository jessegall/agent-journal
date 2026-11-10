from engine.driver.hook_event_version_error import HookEventVersionError


class OldHookRunnerError(HookEventVersionError):
    """A hook runner sent project hooks without decoded answers."""

    @classmethod
    def detected(cls) -> "OldHookRunnerError":
        return cls("the hook runner did not decode the project hook answer; update the hook runner")
