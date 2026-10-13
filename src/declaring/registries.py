from resources.extension import Extension

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

READINESS = Extension()
"""Whether an environment holds open rows and whether any can be taken, registered by the feature that owns what ready means."""

PLAN_STARTS = Extension()
"""What starts a plan's own agent when it is started."""

SECRET_CHECKS = Extension()
"""The checks a feature adds before a setting that runs a command may be written by an agent."""


QUIET_IN_HELPERS = Extension()
"""The features that declare themselves quiet in a helper's or a ticket's environment, by name."""

SAVE_REWRITES = Extension()
"""What each feature rewrites in a row's text before it is saved, by the feature's name."""

SAVE_MARKS = Extension()
SAVE_CHECKS = Extension()
"""What each feature checks of a row before it is saved, by the feature's name."""

CARD_EXTRAS = Extension()
"""What each feature adds to a ticket's card, by the feature's name."""

SHARE_ROUTES = Extension()
"""What each feature serves on the share server, by the first part of the path it answers."""

SHARE_TICKS = Extension()
"""What each feature runs on the share server's own clock."""

EVERY_OTHER = "*"
"""The key of what answers every path no other route does."""

SHARE_KEEP_UP = Extension()
"""What each feature says keeps the share server running, by the feature's name."""

SHARE_LISTENS = Extension()
"""Where each feature says the share server listens, by the feature's name."""

SHARE_ORIGINS = Extension()
"""How each feature names where a request to the share server came from, by the feature's name."""

RELIED_ON = Extension()
"""Whether each feature relies on the journal's address staying as it is, by the feature's name."""



START_PARTS = Extension()
"""The parts of the block a new session reads first, each a function of the record, built in the order of the places they are keyed by."""
ADDRESS, ORCHESTRATION, LAW, SKILLS, MODE = 1, 2, 3, 4, 5


STILL_HELD: dict = {}
"""Whether a hold on an agent's writes still stands, by the key of the hold: each is a function of the record and the session, asked before the hold is let go."""
