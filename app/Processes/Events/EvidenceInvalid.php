<?php

declare(strict_types=1);

namespace App\Processes\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A check's run gave no result: its assessment found problems. Heard once per assessment after it is stored, by the
 * run's actor and the project owner, with every problem code.
 */
final readonly class EvidenceInvalid implements Event, ShouldDispatchAfterCommit
{
    /**
     * @param  list<string>  $codes
     */
    public function __construct(
        public string $assessmentId,
        public string $partRunId,
        public string $actorType,
        public string $actorId,
        public array $codes,
    ) {}
}
