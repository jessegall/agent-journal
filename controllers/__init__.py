from __future__ import annotations

from controllers.reminders import RemindersController

CONTROLLERS = {c.resource: c for c in (RemindersController(),)}
