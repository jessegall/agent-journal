from __future__ import annotations

from controllers.activity import ActivityController
from controllers.agents import AgentsController
from controllers.comments import CommentsController
from controllers.commits import CommitsController
from controllers.docs import DocsController
from controllers.environments import EnvironmentController
from controllers.files import FilesController
from controllers.inbox import InboxController
from controllers.notifications import NotificationsController
from controllers.pins import PinsController, RulesController
from controllers.questions import QuestionsController
from controllers.reports import ReportsController
from controllers.search import SearchController
from controllers.suggestions import SuggestionsController
from controllers.reminders import RemindersController
from controllers.todos import TodosController
from controllers.tools import ToolsController
from controllers.work import WorkController

CONTROLLERS = {c.resource: c for c in (RemindersController(), QuestionsController(), TodosController(),
                                          PinsController(), RulesController(), InboxController(),
                                          WorkController(), DocsController(),
                                          EnvironmentController(), SearchController(), ToolsController(),
                                          ActivityController(), CommentsController(), ReportsController(), NotificationsController(), SuggestionsController(),
                                          FilesController(), CommitsController(), AgentsController())}
