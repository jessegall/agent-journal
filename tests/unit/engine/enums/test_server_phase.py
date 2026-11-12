from engine.journal.journal_home import JournalHome
from engine.serving.server_files import ServerFiles
from engine.enums.server_phase import ServerPhase


def test_the_phase_reads_from_the_server_marks_and_no_mark_reads_as_ready(tmp_path):
    home = JournalHome(tmp_path / ".journal")
    home.folder.mkdir(parents=True)
    files = ServerFiles(home)
    phases = [files.phase()]
    files.start_mark.write_text("1")
    phases.append(ServerFiles(home).phase())
    files.mark_maintenance()
    phases.append(ServerFiles(home).phase())
    files.clear_maintenance()
    files.clear_restart()
    phases.append(ServerFiles(home).phase())
    assert phases == [ServerPhase.READY, ServerPhase.STARTING, ServerPhase.UPDATING, ServerPhase.READY]
