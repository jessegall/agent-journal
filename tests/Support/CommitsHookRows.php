<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Hook tests that commit real rows on the hook database: no wrapping transaction, and the tables the test class lists
 * in its TABLES constant emptied, in one statement, after each test.
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
     * Each test empties what it committed when it ends, so the next one starts on empty tables; the alarm stops before
     * this cleanup, so a slow test still empties them.
     */
    protected function tearDownCommitsHookRows(): void
    {
        $this->emptyTables(...self::TABLES);
    }
}
