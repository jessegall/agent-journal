<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The engine settings of config/engine.php, read once.
 */
final readonly class EngineSettings
{
    public function __construct(
        public string $connection,
        public int $lockKey,
        public int $passBudgetMilliseconds,
        public int $commandBudgetMilliseconds,
        public int $batchSize,
        public int $watchdogSeconds,
    ) {}
}
