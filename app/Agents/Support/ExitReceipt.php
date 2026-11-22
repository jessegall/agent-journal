<?php

declare(strict_types=1);

namespace App\Agents\Support;

use Carbon\CarbonImmutable;
use PhpOption\Option;

/**
 * What the host reports once an execution ended: its exit code when the driver gave one, never a made-up zero.
 */
final readonly class ExitReceipt
{
    /**
     * @param  Option<int>  $exitCode
     */
    public function __construct(
        public ExecutionReference $execution,
        public Option $exitCode,
        public CarbonImmutable $endedAt,
    ) {}
}
