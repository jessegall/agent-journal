<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Enums\WakeState;
use Spatie\LaravelData\Data;

/**
 * Where waking one notified member stands, and the request its runtime accepted, when it did.
 */
final class MemberWake extends Data
{
    public function __construct(
        public string $actorType,
        public string $actorId,
        public string|null $requestId,
        public WakeState $state,
    ) {}
}
