<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;

/**
 * A check's run gave no result: its assessment found problems. Raised once per assessment after it is stored, for the
 * run's actor and the project owner, with every problem code.
 */
final readonly class EvidenceInvalid implements Event
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
