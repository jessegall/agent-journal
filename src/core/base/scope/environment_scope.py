from core.base.scope.scope import Scope


class EnvironmentScope(Scope):
    """What runs in an environment stays in it: reads return that environment's rows and a new row is saved in it."""
