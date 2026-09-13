from __future__ import annotations

from controllers.docs import DocsController
from controllers.environments import EnvironmentController
from controllers.inbox import InboxController
from controllers.pins import PinsController, RulesController
from controllers.questions import QuestionsController
from controllers.search import SearchController
from controllers.reminders import RemindersController
from controllers.todos import TodosController
from controllers.work import WorkController

CONTROLLERS = {c.resource: c for c in (RemindersController(), QuestionsController(), TodosController(),
                                          PinsController(), RulesController(), InboxController(),
                                          WorkController(), DocsController(),
                                          EnvironmentController(), SearchController())}
