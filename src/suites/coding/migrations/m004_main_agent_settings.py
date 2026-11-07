from core.base.database.migration import Migration


class MainAgentSettingsMigration(Migration):
    """Turns Auto off in each environment that already works under the orchestrator driver and has no Auto value of
    its own, because the orchestrator never wrote project files. Every value already set, the keys and the helper
    limits stay as they are, and a second run changes nothing."""

    number = 4
    statements = (
        "INSERT INTO settings (environment_id, creator_id, key, value, created_at, updated_at)"
        " SELECT driver.environment_id, driver.creator_id, 'journal.suites.coding.auto-mode', 'false', driver.updated_at, driver.updated_at"
        " FROM settings AS driver WHERE driver.key = 'journal.core.drivers.driver.main' AND driver.value = '\"coding.orchestrator\"'"
        " AND driver.environment_id IS NOT NULL"
        " AND NOT EXISTS (SELECT 1 FROM settings AS auto WHERE auto.key = 'journal.suites.coding.auto-mode' AND auto.environment_id = driver.environment_id)",
    )
