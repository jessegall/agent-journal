<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\RequestProgress;

/**
 * What an accepted driver request answers its caller: which request, its place in order, where it stands and when it
 * is expected to land, judged from the runtime's last observation, whose time travels as ISO 8601 text (an advisory,
 * doc 40 section 14).
 */
final readonly class DriverReceipt
{
    public function __construct(
        public string $requestId,
        public int $sequence,
        public DriverOperation $operation,
        public RequestProgress $progress,
        public ExpectedTiming $expectedTiming,
        public string|null $observedAt,
    ) {}

}
