class EnvironmentScoped:
    """A model or view whose rows belong to one environment: a query returns only the rows of the environment in
    scope, and a new row gets that environment when it is saved."""

    environment_id: int
