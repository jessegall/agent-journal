<?php

declare(strict_types=1);

namespace App\Communication\Data;

/**
 * Whether one member of a message's destination was woken for it: the wake its runtime accepted, or none when it ran
 * in no runtime.
 */
final readonly class WakeStatus
{
    public function __construct(
        public string $actorType,
        public string $actorId,
        public string|null $requestId,
    ) {}
}
