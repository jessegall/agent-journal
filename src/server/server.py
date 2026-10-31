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
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from server.code_version import CodeFolders, CodeVersion
from server.journal_server import DRAIN_LIMIT_SECONDS, JournalServer, ServerContext
from server.listener_thread import ListenerRound, ListenerThread
from server.request_handler import RequestHandler
from server.server_files import ServerFiles

SECOND_SERVER_CODE = 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(prog="journal server")
    parser.add_argument("--home", required=True)
    home = JournalHome(Path(parser.parse_args(argv).home))
    code_version = CodeVersion(CodeFingerprint(), CodeFolders(ModuleFinder(home)))
    files = ServerFiles(home)
    if not files.acquire_lock():
        files.log_line("another server holds the lock; this one exits")
        return SECOND_SERVER_CODE
    files.clear_leftover_socket()
    listener_round = ListenerRound(home)
    listener_thread = ListenerThread(listener_round.run, listener_round.report)
    server = JournalServer(str(files.socket), RequestHandler, ServerContext(home, code_version, files, Timestamp(datetime.now(timezone.utc)), listener_thread))
    files.restrict_socket()
    files.write_pid()
    files.log_line(f"listening on {files.socket}")
    if threading.current_thread() is threading.main_thread():
        signal.signal(signal.SIGTERM, lambda signal_number, frame: server.request_stop())
    listener_thread.start()
    try:
        server.serve_requests()
        server.drain(DRAIN_LIMIT_SECONDS)
    finally:
        listener_thread.stop()
        files.remove_server_files()
        server.server_close()
        files.release_lock()
        files.log_line("stopped")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
