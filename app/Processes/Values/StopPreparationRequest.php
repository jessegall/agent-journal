<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Support\ActorReference;
use App\Values\AccessPolicy;
use App\Values\WorkReference;

/**
 * One stop to prepare: who stops, on what work, under which profile revision and access, and the stop's own
 * reference, which a replay of the same stop repeats.
 */
final readonly class StopPreparationRequest
{
    public function __construct(
        public ActorReference $actor,
        public WorkReference $work,
        public string $profileKey,
        public int $profileRevision,
        public AccessPolicy $access,
        public string $trigger,
    ) {}
}
