from engine.actor.actor import CORE_ACTOR_ID
from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.statement import Statement
from core.modules.processes.support.stock_digest import StockDigest
from core.modules.processes.support.stock_reader import STOCK_READERS


class StockDigestMigration(Migration):
    """Gives each reader row the digest of the shipped entry it was written from; the stock rows there are now
    get the digest of their current shipped entry."""

    number = 70
    statements = ["ALTER TABLE readers ADD COLUMN shipped_digest TEXT NOT NULL DEFAULT ''"]

    def run(self, database: Database) -> None:
        super().run(database)
        for stock in STOCK_READERS:
            database.update(Statement("UPDATE readers SET shipped_digest = ? WHERE name = ? AND creator_id = ?", [StockDigest.of(stock), stock.name, CORE_ACTOR_ID]))
