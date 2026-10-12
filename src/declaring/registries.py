from declaring.extension import Extension

SETTING_KEYS = Extension()
"""The settings each feature declares, by the feature's name: a controller reads them, a feature fills them."""

SETTINGS_CHANGED = Extension()
"""What each feature runs when one of its settings changes, by the feature's name."""

SHIPPED = Extension()
"""The titles of the sequences a feature ships, by the job a controller finds them for."""

CARD_STORE = Extension()
"""The controller that keeps a board's cards, registered by the feature that owns them."""

PHASE_ROWS = Extension()
"""The row kinds a plan's phase may hold besides to-dos, by the phase field that names them."""

PHASE_STARTS = Extension()
"""What starts the rows of a plan's phase when it begins."""

PLAN_STARTS = Extension()
"""What starts a plan's own agent when it is started."""
