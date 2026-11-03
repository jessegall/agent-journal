import argparse
import math
from datetime import datetime, timezone
import signal
import sys
import threading
import time
from pathlib import Path

if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.base.container import Container
from core.base.journal_container import opened_container
from core.base.journal_home import JournalHome
from core.base.periodic_checks import PeriodicChecks
from core.base.performance.performance_state import PerformanceState
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.base.timestamp import Timestamp
from core.base.timing_log import TimingLog
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from server.booting_work import BootingWork
from server.code_sync_work import CodeSyncWork
from server.code_version import CodeVersion
from server.code_folders import CodeFolders
from server.journal_server import DRAIN_LIMIT_SECONDS, JournalServer
from server.server_context import ServerContext
from server.server_plugin_services import ServerPluginServices
from server.server_tunnel import ServerTunnel
from server.hook.hook_database import HookDatabase
from server.journal_round import JournalRound
from server.listener_thread import STOP_LIMIT_SECONDS, ListenerThread
from server.ordinary_listener_work import OrdinaryListenerWork
from server.urgent_listener_work import UrgentListenerWork
from server.ticker import Ticker
from server.viewer.session_file import SessionFile
from server.viewer.viewer_listener import ViewerListener
from server.viewer.phone_sessions import PhoneSessions
from server.viewer.share_sessions import ShareSessions
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes
from server.request_handler import RequestHandler
from server.server_backup import ServerBackup
from server.server_files import ServerFiles

SECOND_SERVER_CODE = 0

TUNNEL_CHECK_SECONDS = 30.0
SERVICES_CHECK_SECONDS = 30.0
HEALTH_CHECK_SECONDS = 60.0
TICK_PERIOD_SECONDS = 1.0
BACKUP_CHECK_SECONDS = 60.0
CHECK_PERIOD_SECONDS = 60.0

# How often the ticker looks at the code files; a request only reads what it found, and never looks itself.
CODE_CHECK_SECONDS = 10.0


def last_port(home: JournalHome) -> int:
    text = home.viewer_port_file.read_text().strip() if home.viewer_port_file.is_file() else ""
    return int(text) if text.isdigit() else 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(prog="journal server")
    parser.add_argument("--home", required=True)
    home = JournalHome(Path(parser.parse_args(argv).home))
    CodeFingerprint.ticked = True
    code_fingerprint, finder = CodeFingerprint(), ModuleFinder(home)
    code_version = CodeVersion(code_fingerprint, CodeFolders(finder), math.inf)
    files = ServerFiles(home)
    if not files.acquire_lock():
        files.log_line("another server holds the lock; this one exits")
        return SECOND_SERVER_CODE
    PerformanceState(home).begin_start()
    TimingLog(home).rotate()
    files.rotate_log()
    files.clear_leftover_socket()
    urgent_round = JournalRound(home, "urgent listener thread", UrgentListenerWork())
    urgent_thread = ListenerThread(urgent_round.run, urgent_round.report, name="urgent listeners")
    listener_round = JournalRound(home, "listener thread", OrdinaryListenerWork())
    listener_thread = ListenerThread(listener_round.run, listener_round.report, urgent_thread=urgent_thread)
    ticker = Ticker(home, Ticker.module_handlers(finder), listener_thread.wake)
    hook_database = HookDatabase(home)
    phones = PhoneSessions(home, listener_thread)
    login = ViewerLogin(phones, ShareSessions(phones.journal_output), SessionFile(home.viewer_sessions_file))
    viewer = ViewerListener(login, ViewerRoutes(home, listener_thread, login), last_port(home))
    home.viewer_port_file.write_text(str(viewer.port))
    ticker_thread = ListenerThread(ticker.tick, lambda error: files.log_line(f"the ticker could not tick: {error}"), TICK_PERIOD_SECONDS, "ticker")
    tunnel = ServerTunnel(home)
    plugin_services = ServerPluginServices(home)
    backup = ServerBackup(home)

    def check_code(container: Container) -> None:
        code_version.check()
        code_fingerprint.refreshed(finder.modules())

    ticker.register(TickHandler(TickInterval(seconds=CODE_CHECK_SECONDS), check_code, "code check"))
    ticker.register(TickHandler(TickInterval(seconds=CHECK_PERIOD_SECONDS), lambda container: container.get(PeriodicChecks).run(), "checks"))
    ticker.register(TickHandler(TickInterval(seconds=TUNNEL_CHECK_SECONDS), lambda container: tunnel.follow(viewer.port), "tunnel", starts_immediately=True))
    ticker.register(TickHandler(TickInterval(seconds=SERVICES_CHECK_SECONDS), lambda container: plugin_services.follow(), "plugin services", starts_immediately=True))
    ticker.register(TickHandler(TickInterval(seconds=HEALTH_CHECK_SECONDS), lambda container: plugin_services.check_health(), "plugin health"))
    ticker.register(TickHandler(TickInterval(seconds=BACKUP_CHECK_SECONDS), lambda container: backup.follow(), "database copies", starts_immediately=True))
    server =JournalServer(str(files.socket), RequestHandler, ServerContext(home, code_version, files, Timestamp(datetime.now(timezone.utc)), listener_thread, hook_database, viewer, tunnel))
    files.restrict_socket()
    files.write_pid()
    files.log_line(f"listening on {files.socket}")
    if threading.current_thread() is threading.main_thread():
        signal.signal(signal.SIGTERM, lambda signal_number, frame: server.request_stop())
    for starting_round in (JournalRound(home, "code sync", CodeSyncWork(), opened_container),JournalRound(home, "booting", BootingWork())):
        try:
            starting_round.run()
        except Exception as error:
            starting_round.report(error)
    listener_thread.wake()
    listener_thread.start()
    urgent_thread.start()
    ticker_thread.start()
    viewer.start()
    files.clear_restart()
    try:
        server.serve_requests()
        server.drain(DRAIN_LIMIT_SECONDS)
    finally:
        threads = (ticker_thread, listener_thread, urgent_thread)
        for thread in threads:
            thread.signal_stop()
        plugin_services.close()
        tunnel.close()
        viewer.stop()
        deadline = time.monotonic() + STOP_LIMIT_SECONDS
        for thread in threads:
            thread.join(deadline - time.monotonic())
        ticker.join(deadline - time.monotonic())
        hook_database.close()
        files.remove_server_files()
        server.server_close()
        files.release_lock()
        files.log_line("stopped")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
