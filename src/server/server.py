import argparse
from datetime import datetime, timezone
import signal
import sys
import threading
from pathlib import Path

if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.base.timing_log import TimingLog
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from server.code_version import CodeFolders, CodeVersion
from server.journal_server import DRAIN_LIMIT_SECONDS, JournalServer, ServerContext
from server.hook_database import HookDatabase
from server.journal_round import JournalRound
from server.listener_thread import ListenerThread
from server.listener_work import ListenerWork
from server.tick_work import TickWork
from server.viewer.line_route import LineRoute
from server.viewer.viewer_listener import ViewerListener
from server.viewer.viewer_login import ViewerLogin
from server.request_handler import RequestHandler
from server.server_files import ServerFiles

SECOND_SERVER_CODE = 0

TICK_PERIOD_SECONDS = 60.0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(prog="journal server")
    parser.add_argument("--home", required=True)
    home = JournalHome(Path(parser.parse_args(argv).home))
    code_version = CodeVersion(CodeFingerprint(), CodeFolders(ModuleFinder(home)))
    files = ServerFiles(home)
    if not files.acquire_lock():
        files.log_line("another server holds the lock; this one exits")
        return SECOND_SERVER_CODE
    TimingLog(home).rotate()
    files.clear_leftover_socket()
    listener_round = JournalRound(home, "listener thread", ListenerWork())
    listener_thread = ListenerThread(listener_round.run, listener_round.report)
    tick_round = JournalRound(home, "ticker", TickWork())
    hook_database = HookDatabase(home)
    viewer = ViewerListener(ViewerLogin(), LineRoute(home, listener_thread))
    ticker = ListenerThread(tick_round.run, tick_round.report, TICK_PERIOD_SECONDS, "ticker")
    server = JournalServer(str(files.socket), RequestHandler, ServerContext(home, code_version, files, Timestamp(datetime.now(timezone.utc)), listener_thread, hook_database, viewer))
    files.restrict_socket()
    files.write_pid()
    files.log_line(f"listening on {files.socket}")
    if threading.current_thread() is threading.main_thread():
        signal.signal(signal.SIGTERM, lambda signal_number, frame: server.request_stop())
    listener_thread.start()
    ticker.start()
    viewer.start()
    try:
        server.serve_requests()
        server.drain(DRAIN_LIMIT_SECONDS)
    finally:
        viewer.stop()
        ticker.stop()
        listener_thread.stop()
        hook_database.close()
        files.remove_server_files()
        server.server_close()
        files.release_lock()
        files.log_line("stopped")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
