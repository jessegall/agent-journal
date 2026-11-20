<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Hook tests that commit real rows on the hook database: no wrapping transaction, and the tables the test class lists
 * in its TABLES constant emptied, in one statement, before and after each test.
 */
trait CommitsHookRows
{
    use RefreshHookDatabase;

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
        $this->emptyTables(...self::TABLES);
    }

    protected function tearDownCommitsHookRows(): void
    {
        $this->emptyTables(...self::TABLES);
    }
}
