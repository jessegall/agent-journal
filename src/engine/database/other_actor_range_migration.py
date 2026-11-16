from engine.actor.actor import FIRST_OTHER_ACTOR_ID
from engine.database.migration import Migration


class OtherActorRangeMigration(Migration):
    """Refuses an actor that is neither an agent nor the core when it lands below FIRST_OTHER_ACTOR_ID, so the
    low ids stay the agents' own; ActorTable gives such an actor its id."""

    number = 7
    statements = (
        f"CREATE TRIGGER IF NOT EXISTS actors_other_actor_range AFTER INSERT ON actors WHEN NEW.type NOT IN ('agent', 'core') AND NEW.id < {FIRST_OTHER_ACTOR_ID}"
        f" BEGIN SELECT RAISE(ABORT, 'rule: an actor that is not an agent takes an id from {FIRST_OTHER_ACTOR_ID}, which ActorTable gives it'); END",
    )
