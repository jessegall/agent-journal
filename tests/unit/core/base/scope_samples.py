import sqlite3

from core.base.container import Container
from core.base.database.database import Database
from core.base.scope.scopes import Scopes


def empty_database_scopes() -> Scopes:
    container = Container()
    container.bind(Database, Database.configured(sqlite3.connect(":memory:")))
    return container.get(Scopes)
