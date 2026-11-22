<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ExecutionModeType;
use Carbon\CarbonImmutable;

/**
 * What the host reports once a start is under way: the execution it began, where it runs and when.
 */
final readonly class ExecutionReceipt
{
    public function __construct(
        public string $startId,
        public ExecutionReference $execution,
        public ExecutionModeType $executionMode,
        public CarbonImmutable $startedAt,
    ) {}
}
