<?php

declare(strict_types=1);

namespace App\Reads\Values;

/**
 * What one measured operation read: the models it loaded and the queries it sent, with small breakdowns by model
 * class, connection and read or write. It keeps no SQL text, bindings or keys.
 */
final readonly class ReadCounts
{
    /**
     * @param  array<class-string, int>  $modelsByClass
     * @param  array<string, int>  $queriesByConnection
     * @param  array{read: int, write: int}  $queriesByCategory
     */
    public function __construct(
        public int $modelsLoaded = 0,
        public int $queriesRun = 0,
        public int $queriesRefused = 0,
        public int $queriesCompleted = 0,
        public array $modelsByClass = [],
        public array $queriesByConnection = [],
        public array $queriesByCategory = ['read' => 0, 'write' => 0],
    ) {}
}
