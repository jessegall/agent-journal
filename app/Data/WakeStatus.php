<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\WakeState;

/**
 * Whether one member of a message's destination was woken for it: where the wake stands, and the wake its runtime
 * accepted, if any.
 */
final readonly class WakeStatus
{
    public function __construct(
        public string $actorType,
        public string $actorId,
        public string|null $requestId,
        public WakeState $state,
    ) {}
}
