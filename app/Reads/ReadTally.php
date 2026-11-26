<?php

declare(strict_types=1);

namespace App\Reads;

use App\Reads\Values\ReadCounts;

/**
 * The running counts of one open measurement.
 */
final class ReadTally
{
    /**
     * How often a read of one shape from one place may run in a measurement before it counts as a loop.
     */
    public const int READS_BEFORE_A_LOOP = 10;

    /**
     * How often each read shape ran from each place in this measurement.
     *
     * @var array<string, int>
     */
    private array $readsOfShape = [];

    private int $modelsLoaded = 0;

    private int $queriesRun = 0;

    private int $queriesRefused = 0;

    private int $queriesCompleted = 0;

    /**
     * @var array<class-string, int>
     */
    private array $modelsByClass = [];

    /**
     * @var array<string, int>
     */
    private array $queriesByConnection = [];

    /**
     * @var array{read: int, write: int}
     */
    private array $queriesByCategory = [
        'read' => 0,
        'write' => 0,
    ];

    public function addQuery(string $connection, bool $writes): void
    {
        $this->queriesRun++;
        $this->queriesByConnection[$connection] = ($this->queriesByConnection[$connection] ?? 0) + 1;
        $this->queriesByCategory[$writes ? 'write' : 'read']++;
    }

    public function addRefusedQuery(): void
    {
        $this->queriesRefused++;
    }

    public function addCompletedQuery(): void
    {
        $this->queriesCompleted++;
    }

    /**
     * @param  class-string  $model
     */
    public function addModel(string $model): void
    {
        $this->modelsLoaded++;
        $this->modelsByClass[$model] = ($this->modelsByClass[$model] ?? 0) + 1;
    }

    public function counts(): ReadCounts
    {
        return new ReadCounts(
            modelsLoaded: $this->modelsLoaded,
            queriesRun: $this->queriesRun,
            queriesRefused: $this->queriesRefused,
            queriesCompleted: $this->queriesCompleted,
            modelsByClass: $this->modelsByClass,
            queriesByConnection: $this->queriesByConnection,
            queriesByCategory: $this->queriesByCategory,
        );
    }

    /**
     * Whether the same read from the same place has now run more often than a loop is allowed; counts it either way.
     */
    public function readsInALoop(ReadSite $site): bool
    {
        $this->readsOfShape[$site->key()] = ($this->readsOfShape[$site->key()] ?? 0) + 1;

        return $this->readsOfShape[$site->key()] > self::READS_BEFORE_A_LOOP;
    }
}
