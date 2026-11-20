<?php

declare(strict_types=1);

namespace App\Supervision\Values;

use App\Actors\Support\ActorIdentity;
use App\Records\Support\RecordIdentity;

/**
 * Reviewed work to reopen for repair: the work and the worker that did it, what to repair, the source the repair
 * came from, and the ref of the target commit to repair onto when a merge conflicted.
 */
final readonly class WorkRepairRequest
{
    public function __construct(
        public RecordIdentity $work,
        public ActorIdentity $worker,
        public string $findings,
        public string $source,
        public string|null $targetRef,
    ) {}
}
