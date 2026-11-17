<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Hook tests that commit real rows on the hook database: no wrapping transaction, and the tables the test class lists
 * in its TABLES constant emptied before and after each test.
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

    protected function setUpCommitsHookRows(): void
    {
        $this->setUpRefreshHookDatabase();
        $this->emptyTables(...self::TABLES);
    }

    protected function tearDownCommitsHookRows(): void
    {
        $this->emptyTables(...self::TABLES);
    }
}
