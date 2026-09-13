from __future__ import annotations

from controllers.inbox import InboxController
from controllers.pins import PinsController, RulesController
from controllers.questions import QuestionsController
from controllers.reminders import RemindersController
from controllers.todos import TodosController

CONTROLLERS = {c.resource: c for c in (RemindersController(), QuestionsController(), TodosController(),
                                          PinsController(), RulesController(), InboxController())}
