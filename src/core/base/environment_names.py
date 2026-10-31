from core.base.refusal import Refusal


class EnvironmentNames:
    """Converts the environment a command line names with --environment into its id; the environments module binds
    the class that reads its table, and without it no environment can be named."""

    def environment_id(self, name: str) -> int:
        raise Refusal(f"no environment named {name}: environments are not installed")
