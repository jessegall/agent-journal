from core.base.database.migration import Migration


class DockAbstractsMigration(Migration):
    """Documents and reports docked before a docked card showed the abstract take theirs."""

    number = 3
    statements = (
        "UPDATE dock_items SET text = (SELECT abstract FROM docs WHERE docs.id = dock_items.target_id) WHERE target_model = 'doc' AND text = ''",
        "UPDATE dock_items SET text = (SELECT abstract FROM reports WHERE reports.id = dock_items.target_id) WHERE target_model = 'report' AND text = ''",
    )
