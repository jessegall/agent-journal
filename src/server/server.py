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

from engine.time.clock import Clock
from engine.container.container import Container
from engine.hosting.host_probe import HostProbe
from engine.hosting.hosted_file import HOSTED_FILE_PATH, HostedFile
from engine.hosting.hosted_start_check import HostedStartCheck
from engine.module.journal_container import opened_container, synced_database_container
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.enums.log_level import LogLevel
from engine.errors.refusal import Refusal
from engine.check.periodic_checks import PeriodicChecks
from engine.performance.performance_state import PerformanceState
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from engine.performance.timing_log import TimingLog
from engine.module.code_fingerprint import CodeFingerprint
from engine.module.module_finder import ModuleFinder
from engine.database.reported_findings import ReportedFindings
from server.execution.session_starters import SessionStarters
from engine.execution.instant_lane_reading import InstantLaneReading
from server.execution.ticket_admission import TicketAdmission
from engine.process.door.lane_door import LaneDoor
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.round_tickets import RoundTickets
from server.work.booting_work import BootingWork
from server.work.code_sync_work import CodeSyncWork
from server.handover.code_version import CodeVersion
from server.handover.code_folders import CodeFolders
from server.handover.handover_descriptors import HandoverDescriptors
from server.door.hosted_journal_door import HostedJournalDoor
from server.door.local_journal_door import LocalJournalDoor
from server.request.journal_server import JournalServer
from engine.serving.server_limits import DRAIN_LIMIT_SECONDS
from server.context.server_context import ServerContext
from server.tick.server_plugin_services import ServerPluginServices
from server.tick.server_tunnel import ServerTunnel
from server.hook.hook_database import HookDatabase
from server.viewer.request_trace import SETTINGS_REFRESH_SECONDS
from server.work.journal_round import JournalRound
from server.work.listeners.listener_thread import STOP_LIMIT_SECONDS, ListenerThread
from server.work.listeners.listener_wake_router import ListenerWakeRouter
from engine.event.written_events import WrittenEvents
from engine.process.plugin_script_processes import PluginScriptProcesses
from server.work.listeners.ordinary_listener_work import OrdinaryListenerWork
from server.work.listeners.plugin_listener_work import PluginListenerWork
from server.work.listeners.program_stop_listener_work import ProgramStopListenerWork
from server.work.listeners.urgent_listener_work import UrgentListenerWork
from server.tick.ticker import Ticker
from server.viewer.session_file import SessionFile
from server.enums.closed_service import ClosedService
from server.viewer.viewer_listener import ViewerListener
from server.viewer.viewer_socket_listener import ViewerSocketListener
from server.viewer.phone_sessions import PhoneSessions
from server.viewer.share_sessions import ShareSessions
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes
from server.request.request_handler import RequestHandler
from server.tick.server_backup import ServerBackup
from server.tick.inactive_server_shutdown import InactiveServerShutdown
from engine.serving.server_files import ServerFiles
from server.handover.waiting_server import WaitingServer
from functools import partial
from server.execution.write_turn_queue import WriteTurnQueue
from server.work.per_round_container import PerRoundContainer
from server.work.kept_round_container import background_container
from server.work.kept_round_container import KeptRoundContainer

# how long a write waits for the database's write turn before it is refused with the holder named
WRITE_TURN_LIMIT_SECONDS = 30.0

MAX_OPEN_FILES = 10240

ANSWER_LIMIT_SECONDS = 2
SECOND_SERVER_CODE = 0
UNSAFE_HOST_CODE = 1

TUNNEL_CHECK_SECONDS = 30.0
SERVICES_CHECK_SECONDS = 30.0
HEALTH_CHECK_SECONDS = 60.0
TICK_PERIOD_SECONDS = 1.0
BACKUP_CHECK_SECONDS = 60.0
IDLE_CHECK_SECONDS = 30.0
CHECK_PERIOD_SECONDS = 60.0

# How often the ticker looks at the code files; a request only reads what it found, and never looks itself.
CODE_CHECK_SECONDS = 10.0


def last_port(home: JournalHome) -> int:
    text = FileAccess.read(home.viewer_port_file).strip() if FileAccess.is_file(home.viewer_port_file) else ""
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
    turns = WriteTurnQueue(clock, WRITE_TURN_LIMIT_SECONDS, lambda slow_turn_text: files.log_line(slow_turn_text, LogLevel.WARNING))
    hook_database = HookDatabase(home, turns)
    urgent_kept, listener_kept, plugin_kept, stop_kept = (KeptRoundContainer(home, turns) for _ in range(4))
    round_tickets = RoundTickets(hook_database.executions, ExecutionPriorities(SessionStarters.shared(home)), clock)
    InstantLaneReading.shared(home).install(lambda: [entry.reading() for entry in hook_database.executions.read()], hook_database.instant_capacity)
    LaneDoor.shared(home).install(TicketAdmission(hook_database.executions, ExecutionPriorities(SessionStarters.shared(home)), clock).admitted)
    urgent_round = JournalRound(home, "urgent listener thread", UrgentListenerWork(), urgent_kept, hook_database.queue, round_tickets)
    listener_round = JournalRound(home, "listener thread", OrdinaryListenerWork(), listener_kept, hook_database.queue, round_tickets)
    plugin_round = JournalRound(home, "plugin listener thread", PluginListenerWork(), plugin_kept, hook_database.queue, round_tickets)
    stop_round = JournalRound(home, "program stop thread", ProgramStopListenerWork(), stop_kept, hook_database.queue, round_tickets)
    wakes = ListenerWakeRouter(WrittenEvents.shared(), [])
    urgent_thread = ListenerThread(urgent_round.run, urgent_round.report, name="urgent listeners", stop_callback=urgent_round.close, after_round=wakes.wake)
    plugin_thread = ListenerThread(plugin_round.run, plugin_round.report, name="plugin listeners", stop_callback=plugin_round.close, after_round=wakes.wake)
    stop_thread = ListenerThread(stop_round.run, stop_round.report, name="program stops", stop_callback=stop_round.close, after_round=wakes.wake)
    listener_thread = ListenerThread(listener_round.run, listener_round.report, stop_callback=listener_round.close, after_round=wakes.wake)
    wakes.threads = [(urgent_thread, urgent_kept.listener_set), (listener_thread, listener_kept.listener_set), (plugin_thread, plugin_kept.listener_set),
                     (stop_thread, stop_kept.listener_set)]
    ticker = Ticker(home, Ticker.module_handlers(finder), wakes.wake, queue=hook_database.queue, containers=partial(KeptRoundContainer, turns=turns), tickets=round_tickets)
    phones = PhoneSessions(home, wakes, turns)
    login = ViewerLogin(phones, ShareSessions(phones.journal_output, clock), SessionFile(home.viewer_sessions_file))
    reported_findings = ReportedFindings()
    routes = ViewerRoutes(home, wakes, login, reported_findings, hook_database.queue, clock, turns)
    inherited_viewer = waiting_server.viewer_socket() if waiting_server else None
    tunnel = ServerTunnel(home, turns)
    if hosting.is_hosted:
        viewer = ViewerSocketListener(login, routes, files.viewer_socket, hosting.mode.proxy_user, hosting.mode.public_origin, HostProbe().user_id(hosting.mode.proxy_user), inherited_viewer)
        try:
            start_check.check_socket(files.viewer_socket)
        except Refusal as refusal:
            return refused_start_code(files, refusal)
        journal_door = HostedJournalDoor(os.getuid())
    else:
        viewer = ViewerListener(login, routes, tunnel.address, last_port(home), inherited_socket=inherited_viewer)
        journal_door = LocalJournalDoor()
        FileAccess.write(home.viewer_port_file, str(viewer.port))
    ticker_thread = ListenerThread(ticker.tick, lambda error: files.log_line(f"the ticker could not tick: {error}", LogLevel.ERROR), TICK_PERIOD_SECONDS, "ticker")
    plugin_services = ServerPluginServices(home, turns)
    backup = ServerBackup(home, clock, turns)

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
    idle_exit = InactiveServerShutdown(clock, lambda reason: (files.log_line(reason), server.request_stop()))
    ticker.register(TickHandler(TickInterval(seconds=IDLE_CHECK_SECONDS), idle_exit.follow, "idle server exit"))
    server = JournalServer(str(files.socket), RequestHandler, ServerContext(home, code_version, files, clock.timestamp(), wakes, hook_database, viewer, tunnel, reported_findings, journal_door),
                           waiting_server.journal_socket() if waiting_server else None)
    ticker.register(TickHandler(TickInterval(seconds=SETTINGS_REFRESH_SECONDS), lambda container: server.context.request_trace.refresh(container), "request log settings"))
    if waiting_server is not None:
        waiting_server.wait_turn()
        begin_files(home, files)
        login.reload_sessions()
    files.restrict_socket()
    files.write_pid()
    files.log_line(f"listening on {files.socket}")
    if threading.current_thread() is threading.main_thread():
        signal.signal(signal.SIGTERM, lambda signal_number, frame: server.request_stop())
        faulthandler.register(signal.SIGUSR1, file=FileAccess.lifetime_writer(home.stacks_file), all_threads=True)
    for starting_round in (JournalRound(home, "code sync", CodeSyncWork(), PerRoundContainer(home, partial(opened_container, turns=turns))),
                           JournalRound(home, "booting", BootingWork(), PerRoundContainer(home, partial(background_container, turns=turns)))):
        try:
            starting_round.run()
        except Exception as error:
            starting_round.report(error)
    if not viewer.closed_doors.closes_service(ClosedService.PLUGIN_SERVICES):
        try:
            plugin_services.follow()
        except Exception as error:
            files.log_line(f"the plugin services could not be started: {error}", LogLevel.ERROR)
    settings_container = synced_database_container(home, hook_database.databases[0])
    server.context.request_trace.refresh(settings_container)
    for thread in (listener_thread, urgent_thread, plugin_thread, stop_thread):
        thread.wake()
    listener_thread.start()
    urgent_thread.start()
    if not viewer.closed_doors.closes_service(ClosedService.PLUGIN_SCRIPTS):
        plugin_thread.start()
    stop_thread.start()
    ticker.start(Ticker.worker_count(settings_container))
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
        ticker.stop(deadline - time.monotonic())
        server.context.request_trace.close()
        hook_database.close()
        SessionStarters.shared(home).close()
        LaneDoor.shared(home).remove()
        InstantLaneReading.shared(home).remove()
        if not server.is_handing_over:
            files.remove_server_files()
        server.server_close()
        files.release_lock()
        files.log_line("stopped")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
