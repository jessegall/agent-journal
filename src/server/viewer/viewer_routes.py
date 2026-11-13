from engine.database.write_turns import WriteTurns
from engine.time.clock import Clock
from engine.database.reported_findings import ReportedFindings
from engine.journal.journal_home import JournalHome
from server.work.listeners.listener_wake_router import ListenerWakeRouter
from server.viewer.buttons_route import ButtonsRoute
from server.viewer.chat_declarations_route import ChatDeclarationsRoute
from server.hook.server_queue import ServerQueue
from server.viewer.event_stream import EventStream
from server.viewer.file_route import FileRoute
from server.viewer.line_route import LineRoute
from server.viewer.window_data_route import WindowDataRoute
from server.viewer.module_files import ModuleFiles
from server.viewer.share_route import ShareRoute
from server.viewer.push_route import PushRoute
from server.viewer.server_state_route import ServerStateRoute
from server.viewer.session_route import SessionRoute
from server.viewer.skills_route import SkillsRoute
from server.viewer.viewer_login import ViewerLogin
from server.viewer.waiting_route import WaitingRoute
from server.viewer.windows_route import WindowsRoute
from server.viewer.request_trace import RequestTrace


class ViewerRoutes:
    """The routes of the viewer's listener behind its login: command lines, the event stream,
    module files, the windows on offer, the chat marks and docked items modules declare, the
    skills, the files the chat carries, the session the cookie opened, a share link's opening,
    what waits on the user, and whether the server is restarting."""

    def __init__(self, home: JournalHome, wakes: ListenerWakeRouter, login: ViewerLogin, reported: ReportedFindings, queue: ServerQueue, clock: Clock,
                 turns: WriteTurns | None = None) -> None:
        self.queue, self.clock = queue, clock
        self.request_trace = RequestTrace(home, clock)
        self.priorities = self.request_trace.priorities
        self.line_route, self.event_stream = LineRoute(home, wakes, reported, queue, self.request_trace.completed, turns), EventStream(home, turns)
        self.window_data = WindowDataRoute(self.priorities, self.line_route)
        self.module_files, self.windows_route = ModuleFiles(home, turns), WindowsRoute(home, turns)
        self.buttons_route = ButtonsRoute(home, turns)
        self.chat_declarations_route, self.session_route = ChatDeclarationsRoute(home, turns), SessionRoute(login, home, turns)
        self.waiting_route, self.server_state_route = WaitingRoute(home, turns), ServerStateRoute(home, clock)
        self.skills_route = SkillsRoute(home, turns)
        self.share_route = ShareRoute(login.shares)
        self.notices_route = PushRoute(login, login.phones)
        self.file_route = FileRoute(home)
