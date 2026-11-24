<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\DriverOperation;
use App\Enums\ExpectedTiming;
use App\Enums\RequestProgress;

/**
 * What an accepted driver request answers its caller: which request, its place in order, where it stands and when it
 * is expected to land, judged from the runtime's last observation, whose time travels as ISO 8601 text as an advisory.
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
