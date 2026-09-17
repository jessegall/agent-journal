from __future__ import annotations

from controllers.activity import ActivityController
from controllers.agents import AgentsController
from controllers.agent import AgentController
from controllers.chat import ChatController
from controllers.comments import CommentsController
from controllers.connections import ConnectionsController
from controllers.commits import CommitsController
from controllers.docs import DocsController
from controllers.environments import EnvironmentController
from controllers.files import FilesController
from controllers.inbox import InboxController
from controllers.journal import JournalController
from controllers.notifications import NotificationsController
from controllers.pins import PinsController, RulesController
from controllers.plans import PlansController
from controllers.questions import QuestionsController
from controllers.reports import ReportsController
from controllers.search import SearchController
from controllers.style import StyleController
from controllers.suggestions import SuggestionsController
from controllers.reminders import RemindersController
from controllers.todos import TodosController
from controllers.tools import ToolsController
from controllers.work import WorkController

CONTROLLERS = {c.resource: c for c in (RemindersController(), QuestionsController(), TodosController(),
                                          PinsController(), RulesController(), InboxController(),
                                          WorkController(), DocsController(),
                                          EnvironmentController(), SearchController(), ToolsController(),
                                          ActivityController(), ChatController(), CommentsController(), ConnectionsController(), ReportsController(), PlansController(), NotificationsController(), SuggestionsController(),
                                          FilesController(), CommitsController(), AgentsController(), AgentController(), StyleController(), JournalController())}
