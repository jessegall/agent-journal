<?php

declare(strict_types=1);

namespace App\Agents\Values;

use Carbon\CarbonImmutable;

/**
 * What the host found in an actor's checkout at one sample: whether it could read it, whether it is dirty, whether it
 * is positively clean, its generation and when it looked. Clean is never the negation of dirty: a failed read is
 * neither. A version 2 sample also names its commit.
 */
final readonly class WorkspaceFacts
{
    public function __construct(
        public bool $isAvailable,
        public bool $isDirty,
        public bool $isClean,
        public int $generation,
        public CarbonImmutable $sampledAt,
        public CommitObservation $commit,
    ) {}
}
