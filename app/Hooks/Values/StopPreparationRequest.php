<?php

declare(strict_types=1);

namespace App\Hooks\Values;

use App\Actors\Support\ActorIdentity;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\WorkReference;

/**
 * One stop to prepare: who stops, on what work, under which profile revision and access, and the stop's own
 * reference, which a replay of the same stop repeats.
 */
final readonly class StopPreparationRequest
{
    public function __construct(
        public ActorIdentity $actor,
        public WorkReference $work,
        public string $profileKey,
        public int $profileRevision,
        public AccessPolicy $access,
        public string $trigger,
    ) {}
}
