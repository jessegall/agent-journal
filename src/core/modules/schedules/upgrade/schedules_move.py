from engine.upgrade.table_drop_move import TableDropMove


class SchedulesMove(TableDropMove):
    """A scheduled job exists only in its agent program's session, so version 4's rows name jobs that are gone;
    they are dropped and stay in the backup."""

    name = "schedules"
    drops = ["scheduled_jobs"]
