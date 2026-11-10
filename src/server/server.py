import argparse
import faulthandler
import math
import os
import resource
import signal
import sys
import threading
import time
from pathlib import Path

if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.base.clock import Clock
from core.base.container import Container
from core.base.hosting.host_probe import HostProbe
from core.base.hosting.hosted_file import HOSTED_FILE_PATH, HostedFile
from core.base.hosting.hosted_start_check import HostedStartCheck
from core.base.journal_container import opened_container, synced_database_container
from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.log_level import LogLevel
from engine.errors.refusal import Refusal
from core.base.periodic_checks import PeriodicChecks
from core.base.performance.performance_state import PerformanceState
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.base.timing_log import TimingLog
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.database.reported_findings import ReportedFindings
from server.booting_work import BootingWork
from server.code_sync_work import CodeSyncWork
from server.code_version import CodeVersion
from server.code_folders import CodeFolders
from server.handover_descriptors import HandoverDescriptors
from server.hosted_journal_door import HostedJournalDoor
from server.local_journal_door import LocalJournalDoor
from server.journal_server import JournalServer
from core.base.serving.server_limits import DRAIN_LIMIT_SECONDS
from server.server_context import ServerContext
from server.server_plugin_services import ServerPluginServices
from server.server_tunnel import ServerTunnel
from server.hook.hook_database import HookDatabase
from server.request_log import SETTINGS_REFRESH_SECONDS
from server.journal_round import JournalRound
from server.listener_thread import STOP_LIMIT_SECONDS, ListenerThread
from core.base.plugin_script_processes import PluginScriptProcesses
from server.ordinary_listener_work import OrdinaryListenerWork
from server.plugin_listener_work import PluginListenerWork
from server.program_stop_listener_work import ProgramStopListenerWork
from server.urgent_listener_work import UrgentListenerWork
from server.ticker import Ticker
from server.viewer.session_file import SessionFile
from server.viewer.closed_service import ClosedService
from server.viewer.viewer_listener import ViewerListener
from server.viewer.viewer_socket_listener import ViewerSocketListener
from server.viewer.phone_sessions import PhoneSessions
from server.viewer.share_sessions import ShareSessions
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes
from server.request_handler import RequestHandler
from server.server_backup import ServerBackup
from core.base.serving.server_files import ServerFiles
from server.waiting_server import WaitingServer

MAX_OPEN_FILES = 10240

ANSWER_LIMIT_SECONDS = 2
SECOND_SERVER_CODE = 0
UNSAFE_HOST_CODE = 1

TUNNEL_CHECK_SECONDS = 30.0
SERVICES_CHECK_SECONDS = 30.0
HEALTH_CHECK_SECONDS = 60.0
TICK_PERIOD_SECONDS = 1.0
BACKUP_CHECK_SECONDS = 60.0
CHECK_PERIOD_SECONDS = 60.0

# How often the ticker looks at the code files; a request only reads what it found, and never looks itself.
CODE_CHECK_SECONDS = 10.0


def last_port(home: JournalHome) -> int:
    text = FileAccess.shared().read(home.viewer_port_file).strip() if home.viewer_port_file.is_file() else ""
    return int(text) if text.isdigit() else 0


def refused_start_code(files: ServerFiles, refusal: Refusal) -> int:
    files.log_line(refusal.text, LogLevel.ERROR)
    print(refusal.text, file=sys.stderr)
    return UNSAFE_HOST_CODE


def begin_files(home: JournalHome, files: ServerFiles) -> None:
    PerformanceState(home).begin_start()
    TimingLog(home).rotate()
    files.rotate_log()


def raise_file_limit() -> None:
    soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
    target = MAX_OPEN_FILES if hard == resource.RLIM_INFINITY else min(MAX_OPEN_FILES, hard)
    if soft < target:
        resource.setrlimit(resource.RLIMIT_NOFILE, (target, hard))


def main(argv: list[str]) -> int:
    raise_file_limit()
    parser = argparse.ArgumentParser(prog="journal server")
    parser.add_argument("--home", required=True)
    parser.add_argument("--take-over", default="")
    arguments = parser.parse_args(argv)
    home = JournalHome(Path(arguments.home))
    CodeFingerprint.ticked = True
    code_fingerprint, finder = CodeFingerprint(), ModuleFinder(home)
    code_version = CodeVersion(code_fingerprint, CodeFolders(finder), math.inf)
    clock = Clock()
    files = ServerFiles(home)
    hosting = HostedFile.shared_hosting(home)
    start_check = HostedStartCheck(hosting, HostProbe(), HOSTED_FILE_PATH)
    try:
        start_check.check_host()
    except Refusal as refusal:
        return refused_start_code(files, refusal)
    waiting_server = WaitingServer(home, HandoverDescriptors.parsed(arguments.take_over)) if arguments.take_over else None
    if waiting_server is not None:
        files.keep_lock_descriptor(waiting_server.descriptors.lock)
    elif files.acquire_lock():
        begin_files(home, files)
        files.clear_leftover_socket()
    else:
        files.log_line("another server holds the lock; this one exits")
        return SECOND_SERVER_CODE
    hook_database = HookDatabase(home)
    urgent_round = JournalRound(home, "urgent listener thread", UrgentListenerWork(), queue=hook_database.queue)
    urgent_thread = ListenerThread(urgent_round.run, urgent_round.report, name="urgent listeners")
    listener_round = JournalRound(home, "listener thread", OrdinaryListenerWork(), queue=hook_database.queue)
    plugin_round = JournalRound(home, "plugin listener thread", PluginListenerWork(), queue=hook_database.queue)
    plugin_thread = ListenerThread(plugin_round.run, plugin_round.report, name="plugin listeners")
    stop_round = JournalRound(home, "program stop thread", ProgramStopListenerWork(), queue=hook_database.queue)
    stop_thread = ListenerThread(stop_round.run, stop_round.report, name="program stops")
    listener_thread = ListenerThread(listener_round.run, listener_round.report, linked_threads=(urgent_thread, plugin_thread, stop_thread))
    ticker = Ticker(home, Ticker.module_handlers(finder), listener_thread.wake, queue=hook_database.queue)
    phones = PhoneSessions(home, listener_thread)
    login = ViewerLogin(phones, ShareSessions(phones.journal_output, clock), SessionFile(home.viewer_sessions_file))
    reported_findings = ReportedFindings()
    routes = ViewerRoutes(home, listener_thread, login, reported_findings, hook_database.queue, clock)
    inherited_viewer = waiting_server.viewer_socket() if waiting_server else None
    if hosting.is_hosted:
        viewer = ViewerSocketListener(login, routes, files.viewer_socket, hosting.mode.proxy_user, hosting.mode.public_origin, HostProbe().user_id(hosting.mode.proxy_user), inherited_viewer)
        try:
            start_check.check_socket(files.viewer_socket)
        except Refusal as refusal:
            return refused_start_code(files, refusal)
        journal_door = HostedJournalDoor(os.getuid())
    else:
        viewer = ViewerListener(login, routes, last_port(home), inherited_socket=inherited_viewer)
        journal_door = LocalJournalDoor()
        FileAccess.shared().write(home.viewer_port_file, str(viewer.port))
    ticker_thread = ListenerThread(ticker.tick, lambda error: files.log_line(f"the ticker could not tick: {error}", LogLevel.ERROR), TICK_PERIOD_SECONDS, "ticker")
    tunnel = ServerTunnel(home)
    plugin_services = ServerPluginServices(home)
    backup = ServerBackup(home, clock)

    def check_code(container: Container) -> None:
        code_version.check()
        code_fingerprint.refreshed(finder.modules())

    ticker.register(TickHandler(TickInterval(seconds=CODE_CHECK_SECONDS), check_code, "code check"))
    ticker.register(TickHandler(TickInterval(seconds=CHECK_PERIOD_SECONDS), lambda container: container.get(PeriodicChecks).run(), "checks"))
    if not viewer.closed_doors.closes_service(ClosedService.TUNNEL):
        ticker.register(TickHandler(TickInterval(seconds=TUNNEL_CHECK_SECONDS), lambda container: tunnel.follow(viewer.port), "tunnel", starts_immediately=True))
    if not viewer.closed_doors.closes_service(ClosedService.PLUGIN_SERVICES):
        ticker.register(TickHandler(TickInterval(seconds=SERVICES_CHECK_SECONDS), lambda container: plugin_services.follow(), "plugin services", starts_immediately=True))
        ticker.register(TickHandler(TickInterval(seconds=HEALTH_CHECK_SECONDS), lambda container: plugin_services.check_health(), "plugin health"))
    ticker.register(TickHandler(TickInterval(seconds=BACKUP_CHECK_SECONDS), lambda container: backup.follow(), "database copies", starts_immediately=True))
    server = JournalServer(str(files.socket), RequestHandler, ServerContext(home, code_version, files, clock.timestamp(), listener_thread, hook_database, viewer, tunnel, reported_findings, journal_door),
                           waiting_server.journal_socket() if waiting_server else None)
    ticker.register(TickHandler(TickInterval(seconds=SETTINGS_REFRESH_SECONDS), lambda container: server.context.request_log.refresh(container), "request log settings"))
    if waiting_server is not None:
        waiting_server.wait_turn()
        begin_files(home, files)
        login.reload_sessions()
    files.restrict_socket()
    files.write_pid()
    files.log_line(f"listening on {files.socket}")
    if threading.current_thread() is threading.main_thread():
        signal.signal(signal.SIGTERM, lambda signal_number, frame: server.request_stop())
        faulthandler.register(signal.SIGUSR1, file=home.stacks_file.open("a"), all_threads=True)
    for starting_round in (JournalRound(home, "code sync", CodeSyncWork(), opened_container),JournalRound(home, "booting", BootingWork())):
        try:
            starting_round.run()
        except Exception as error:
            starting_round.report(error)
    if not viewer.closed_doors.closes_service(ClosedService.PLUGIN_SERVICES):
        try:
            plugin_services.follow()
        except Exception as error:
            files.log_line(f"the plugin services could not be started: {error}", LogLevel.ERROR)
    server.context.request_log.refresh(synced_database_container(home, hook_database.databases[0]))
    listener_thread.wake()
    listener_thread.start()
    urgent_thread.start()
    if not viewer.closed_doors.closes_service(ClosedService.PLUGIN_SCRIPTS):
        plugin_thread.start()
    stop_thread.start()
    ticker_thread.start()
    viewer.start()
    files.clear_restart()
    files.clear_dead_run_lock()
    try:
        server.serve_requests()
        server.drain(DRAIN_LIMIT_SECONDS)
    finally:
        threads = (ticker_thread, listener_thread, urgent_thread, plugin_thread, stop_thread)
        for thread in threads:
            thread.signal_stop()
        PluginScriptProcesses.shared(home).stop_all()
        server.drain(ANSWER_LIMIT_SECONDS)
        if not server.is_handing_over:
            plugin_services.close()
        tunnel.close()
        viewer.stop()
        deadline = time.monotonic() + STOP_LIMIT_SECONDS
        for thread in threads:
            thread.join(deadline - time.monotonic())
        ticker.join(deadline - time.monotonic())
        server.context.request_log.close()
        hook_database.close()
        if not server.is_handing_over:
            files.remove_server_files()
        server.server_close()
        files.release_lock()
        files.log_line("stopped")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
