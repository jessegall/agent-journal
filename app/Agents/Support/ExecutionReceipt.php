<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ExecutionModeType;
use Carbon\CarbonImmutable;

/**
 * What the host reports once a launch started: the execution it started, where it runs and when.
 */
final readonly class ExecutionReceipt
{
    public function __construct(
        public string $launchId,
        public ExecutionReference $execution,
        public ExecutionModeType $executionMode,
        public CarbonImmutable $startedAt,
    ) {}
}
