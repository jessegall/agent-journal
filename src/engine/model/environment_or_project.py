class EnvironmentOrProject:
    """A model whose rows hold for one environment or, with no environment, for the whole project, read across every
    environment: its events belong to the row's own environment, never to the environment of the line that wrote it."""

    environment_id: int | None
