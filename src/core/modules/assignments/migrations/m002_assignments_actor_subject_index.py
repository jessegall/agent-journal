from engine.database.migration import Migration


class AssignmentsActorSubjectIndexMigration(Migration):
    """Reads the rows an actor holds from the index on the actor alone: the index also holds the row's id, so the
    open tasks of an agent are found without reading every assignment of the model."""

    number = 2
    statements = ["DROP INDEX assignments_actor", "CREATE INDEX assignments_actor ON assignments (actor_id, subject_model, subject_id)"]
