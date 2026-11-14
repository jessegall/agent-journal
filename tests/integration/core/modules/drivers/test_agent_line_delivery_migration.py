import sqlite3

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from core.modules.drivers.migrations.m065_agent_line_delivery import AgentLineDeliveryMigration


def test_an_old_line_gets_terminal_typing_as_its_delivery(tmp_path):
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir()
    connection = sqlite3.connect(home.database)
    connection.execute("CREATE TABLE agent_lines (id INTEGER PRIMARY KEY, text TEXT)")
    connection.execute("INSERT INTO agent_lines (id, text) VALUES (1, 'go on')")
    connection.commit()
    connection.close()
    database = Database.opened(home)
    AgentLineDeliveryMigration().run(database)
    database.close()
    with sqlite3.connect(home.database) as reopened:
        assert reopened.execute("SELECT delivery FROM agent_lines").fetchall() == [("terminal_typing",)]
