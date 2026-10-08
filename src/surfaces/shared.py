from controllers.base import SHARED_ENVIRONMENTS

ENVIRONMENT_OF = {"environment": lambda row: row.get("title"), "ticket": lambda row: row.get("data", {}).get("work_environment")}


def shared(environment: str | None) -> bool:
    """Whether the person reading may see what belongs to this environment: always, unless a member reads and the owner has not shared it."""
    names = SHARED_ENVIRONMENTS.get()
    return names is None or not environment or environment in names


def row_shared(type_: str, row: dict) -> bool:
    """Rows of the project as a whole are every reader's; an environment's own row and a ticket's go only to readers it is shared with."""
    named = ENVIRONMENT_OF.get(type_)
    return named is None or shared(named(row))
