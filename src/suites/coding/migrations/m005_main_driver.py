from engine.database.migration import Migration

OLD_RULES = ("coding.builder-next-task-at-stop", "coding.orchestrator-open-tasks-at-stop", "coding.orchestrator-starts-no-task")
OLD_RULE_LIST = ", ".join(f"'{name}'" for name in OLD_RULES)
OLD_DRIVER_LIST = "'\"coding.builder\"', '\"coding.orchestrator\"'"


class MainDriverMigration(Migration):
    """Moves every environment to the one coding.main driver. An environment that worked under the
    orchestrator keeps its way of working by taking Keep going on, as Auto was set off before. Saved
    refusal skips and stop-check records take the name of the main stop rule, and a saved orchestrator
    layout is copied for coding.main when none exists; the old layout rows stay. A second run changes
    nothing."""

    number = 5
    statements = (
        "INSERT INTO settings (environment_id, creator_id, key, value, created_at, updated_at)"
        " SELECT driver.environment_id, driver.creator_id, 'journal.suites.coding.continue-while-delegatable', 'true', driver.updated_at, driver.updated_at"
        " FROM settings AS driver WHERE driver.key = 'journal.core.drivers.driver.main' AND driver.value = '\"coding.orchestrator\"' AND driver.environment_id IS NOT NULL"
        " AND NOT EXISTS (SELECT 1 FROM settings AS kept WHERE kept.key = 'journal.suites.coding.continue-while-delegatable' AND kept.environment_id = driver.environment_id)",
        f"UPDATE settings SET value = '\"coding.main\"' WHERE key = 'journal.core.drivers.driver.main' AND value IN ({OLD_DRIVER_LIST})",
        f"UPDATE refusal_skips SET name = 'coding.main-stop' WHERE name IN ({OLD_RULE_LIST})",
        *(f"UPDATE hook_calls SET metadata = replace(metadata, '\"{name}\"', '\"coding.main-stop\"') WHERE metadata LIKE '%\"{name}\"%'" for name in OLD_RULES),
        "INSERT INTO viewer_layouts (environment_id, person_id, creator_id, suite, page, driver, layout, created_at, updated_at)"
        " SELECT old.environment_id, old.person_id, old.creator_id, old.suite, old.page, 'coding.main', old.layout, old.created_at, old.updated_at"
        " FROM viewer_layouts AS old WHERE old.suite = 'coding' AND old.driver = 'coding.orchestrator'"
        " AND NOT EXISTS (SELECT 1 FROM viewer_layouts AS existing WHERE existing.environment_id = old.environment_id AND existing.person_id = old.person_id"
        " AND existing.suite = old.suite AND existing.page = old.page AND existing.driver = 'coding.main')",
    )
