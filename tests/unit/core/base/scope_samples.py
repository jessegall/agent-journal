import sqlite3

from engine.container.container import Container
from core.base.database.database import Database
from core.base.scope.scopes import Scopes


def empty_database_scopes() -> Scopes:
    container = Container()
    connection = sqlite3.connect(":memory:")
    connection.execute("CREATE TABLE agents (id INTEGER PRIMARY KEY, role TEXT, environment_id INTEGER)")
    container.bind(Database, Database.configured(connection))
    return container.get(Scopes)
