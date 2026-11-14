class UnscopedReadError(AssertionError):
    """A read of environment-scoped rows ran with no environment in force and no declared skip: raised where
    unscoped reads raise, as under the story kit (task 8897)."""

    @classmethod
    def read(cls, model_name: str) -> "UnscopedReadError":
        return cls(f"a read of {model_name} rows has no environment set: open a scope, or name every_environment(reason) on the read")
