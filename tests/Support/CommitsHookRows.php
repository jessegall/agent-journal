<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Hook tests that commit real rows on the hook database: no wrapping transaction, and the tables the test class lists
 * in its TABLES constant emptied, in one statement, before and after each test. A table that was empty when the test
 * began and holds rows when it ends is emptied too, so a row the test wrote through a listener reaches no later test.
 */
trait CommitsHookRows
{
    use RefreshHookDatabase;

    /**
     * The tables that held rows when the test began, the ones a migration put there.
     *
     * @var list<string>
     */
    private array $tablesHoldingRowsAtStart = [];

    /**
     * @return list<string|null>
     */
    protected function connectionsToTransact(): array
    {
        return [];
    }

    /**
     * A test starts on empty tables, without the rows a migration put there, and empties what it committed when it
     * ends, so tests of other classes find none of it; each is one statement.
     */
    protected function setUpCommitsHookRows(): void
    {
        $this->emptyTables(...static::TABLES);
        $this->tablesHoldingRowsAtStart = $this->tablesHoldingRows();
    }

    protected function tearDownCommitsHookRows(): void
    {
        $written = array_diff($this->tablesHoldingRows(), $this->tablesHoldingRowsAtStart);
        $this->emptyTables(...array_values(array_unique([...static::TABLES, ...$written])));
    }
}
