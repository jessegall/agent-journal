from engine.database.migration import Migration


class PersonRowIndexesMigration(Migration):
    """Indexes a person's presets and layouts by the person, so a read that spans every environment finds them."""

    number = 4
    statements = ["CREATE INDEX person_presets_person ON person_presets (person_id, page)",
                  "CREATE INDEX viewer_layouts_person ON viewer_layouts (person_id, suite, page, driver)"]
