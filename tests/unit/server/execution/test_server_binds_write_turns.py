from engine.cli.line_run import LineRun
from engine.database.database import Database
from engine.database.never_waiting_write_turns import NeverWaitingWriteTurns
from engine.database.reported_findings import ReportedFindings
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from server.execution.write_turn_queue import WriteTurnQueue
from server.hook.hook_database import HookDatabase
from server.tick.server_backup import ServerBackup
from server.tick.server_plugin_services import ServerPluginServices
from server.tick.server_tunnel import ServerTunnel
from server.viewer.phone_sessions import PhoneSessions
from server.viewer.share_sessions import ShareSessions
from server.viewer.viewer_key_route import ViewerKeyRoute
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes
from server.work.listeners.listener_thread import ListenerThread

LIMIT_SECONDS = 30.0


def test_server_databases_share_one_turn_queue(tmp_path):
    home, clock = JournalHome(tmp_path), Clock()
    turns = WriteTurnQueue(clock, LIMIT_SECONDS, lambda slow_turn_text: None)
    hook_database = HookDatabase(home, turns, running_hooks_count=1)
    listener_thread = ListenerThread(lambda: None, lambda error: None)
    phones = PhoneSessions(home, listener_thread, turns)
    login = ViewerLogin(phones, ShareSessions(phones.journal_output, clock))
    routes = ViewerRoutes(home, listener_thread, login, ReportedFindings(), hook_database.queue, clock, turns)
    openers = [phones.line_run, routes.line_route.line_run, routes.event_stream, routes.module_files, routes.windows_route, routes.buttons_route,
               routes.chat_declarations_route, routes.session_route, routes.waiting_route, routes.skills_route, ViewerKeyRoute(home, login, turns),
               ServerTunnel(home, turns), ServerBackup(home, clock, turns), ServerPluginServices(home, turns)]
    assert [type(opener).__name__ for opener in openers if opener.turns is not turns] == []
    assert all(database.turns is turns for database in hook_database.databases)


def test_stopped_server_command_uses_no_waiting_turns(tmp_path):
    home = JournalHome(tmp_path)
    database = Database.opened(home, LineRun(home).turns)
    try:
        assert isinstance(database.turns, NeverWaitingWriteTurns)
    finally:
        database.close()
