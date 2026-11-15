from engine.database.migration import Migration


class WaitingCheckpointsPassedMigration(Migration):
    """Gives each checkpoint whose merged run passed and that waited for a person its pass, now that nothing
    waits for a person: the phases after it open."""

    number = 21
    statements = ["INSERT INTO checkpoint_passes (environment_id, creator_id, plan_id, phase_id, passed_at, created_at, updated_at)"
                  " SELECT reach.environment_id, reach.creator_id, reach.plan_id, reach.phase_id, reach.updated_at, reach.updated_at, reach.updated_at"
                  " FROM checkpoint_reaches reach WHERE reach.source = 'merged' AND reach.state = 'passed'"
                  " AND reach.id = (SELECT MAX(newest.id) FROM checkpoint_reaches newest WHERE newest.plan_id = reach.plan_id AND newest.phase_id = reach.phase_id AND newest.source = 'merged')"
                  " AND NOT EXISTS (SELECT 1 FROM checkpoint_passes pass WHERE pass.plan_id = reach.plan_id AND pass.phase_id = reach.phase_id)"]
