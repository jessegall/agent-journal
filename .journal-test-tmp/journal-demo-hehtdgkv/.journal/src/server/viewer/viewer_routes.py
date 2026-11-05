from core.base.journal_home import JournalHome
from server.listener_thread import ListenerThread
from server.viewer.buttons_route import ButtonsRoute
from server.viewer.chat_declarations_route import ChatDeclarationsRoute
from server.viewer.event_stream import EventStream
from server.viewer.file_route import FileRoute
from server.viewer.line_route import LineRoute
from server.viewer.module_files import ModuleFiles
from server.viewer.share_route import ShareRoute
from server.viewer.push_route import PushRoute
from server.viewer.server_state_route import ServerStateRoute
from server.viewer.session_route import SessionRoute
from server.viewer.skills_route import SkillsRoute
from server.viewer.viewer_login import ViewerLogin
from server.viewer.waiting_route import WaitingRoute
from server.viewer.windows_route import WindowsRoute


class ViewerRoutes:
    """The routes of the viewer's listener behind its login: command lines, the event stream,
    module files, the windows on offer, the chat marks and docked items modules declare, the
    skills, the files the chat carries, the session the cookie opened, a share link's opening,
    what waits on the person, and whether the server is restarting."""

    def __init__(self, home: JournalHome, listener_thread: ListenerThread, login: ViewerLogin) -> None:
        self.line_route, self.event_stream = LineRoute(home, listener_thread), EventStream(home)
        self.module_files, self.windows_route = ModuleFiles(home), WindowsRoute(home)
        self.buttons_route = ButtonsRoute(home)
        self.chat_declarations_route, self.session_route = ChatDeclarationsRoute(home), SessionRoute(login, home)
        self.waiting_route, self.server_state_route = WaitingRoute(home), ServerStateRoute(home)
        self.skills_route = SkillsRoute(home)
        self.share_route = ShareRoute(login.shares)
        self.notices_route = PushRoute(login, login.phones)
        self.file_route = FileRoute(home)
