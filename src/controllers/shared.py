from controllers.base import SHARED_ENVIRONMENTS

ENVIRONMENT_OF = {"environment": lambda row: row.get("title"), "ticket": lambda row: row.get("data", {}).get("work_environment")}


def environment_of(type_: str, row: dict) -> str | None:
    """The environment a row is the row of, an environment's own or a ticket's, or None for a row of the project as a whole."""
    named = ENVIRONMENT_OF.get(type_)
    if named is None:
        return None
    return named(row) or None


def shared(environment: str | None) -> bool:
    """Whether the person reading may see what belongs to this environment: always, unless a member reads and the owner has not shared it."""
    names = SHARED_ENVIRONMENTS.get()
    return names is None or not environment or environment in names


def row_shared(type_: str, row: dict) -> bool:
    return shared(environment_of(type_, row))
