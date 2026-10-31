from core.base.journal_home import JournalHome
from server.listener_thread import ListenerThread
from server.viewer.chat_declarations_route import ChatDeclarationsRoute
from server.viewer.event_stream import EventStream
from server.viewer.line_route import LineRoute
from server.viewer.module_files import ModuleFiles
from server.viewer.session_route import SessionRoute
from server.viewer.viewer_login import ViewerLogin
from server.viewer.waiting_route import WaitingRoute
from server.viewer.windows_route import WindowsRoute


class ViewerRoutes:
    """The routes of the viewer's listener behind its login: command lines, the event stream, module files, the
    windows on offer, the chat marks and docked items modules declare, the session the cookie opened, and what waits on the person."""

    def __init__(self, home: JournalHome, listener_thread: ListenerThread, login: ViewerLogin) -> None:
        self.line_route, self.event_stream = LineRoute(home, listener_thread), EventStream(home)
        self.module_files, self.windows_route = ModuleFiles(home), WindowsRoute(home)
        self.chat_declarations_route, self.session_route = ChatDeclarationsRoute(home), SessionRoute(login)
        self.waiting_route = WaitingRoute(home)
