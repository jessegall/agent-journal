from engine.upgrade.table_drop_move import TableDropMove


class UpdatesMove(TableDropMove):
    """Version 4's release messages were written for version 4's releases; they are dropped and stay in the
    backup."""

    name = "updates"
    drops = ["release_messages"]
