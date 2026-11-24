<?php

declare(strict_types=1);

namespace App\Support;

use Carbon\CarbonImmutable;

/**
 * What the owner of a helper knows about its work, handed to Agents as flat facts: whether it has work still open,
 * whether it did this purpose before, and when its last matching and last job of any purpose finished.
 */
final readonly class LaunchCandidateFacts
{
    public function __construct(
        public ActorIdentity $actor,
        public bool $hasOpenWork,
        public bool $hasDoneThisPurpose,
        public CarbonImmutable|null $lastMatchingFinish,
        public CarbonImmutable|null $lastFinish,
    ) {}

    /**
     * When the work that ranks it last finished: this purpose's when it did it, else any.
     */
    public function rankingFinish(): CarbonImmutable|null
    {
        return $this->hasDoneThisPurpose ? $this->lastMatchingFinish : $this->lastFinish;
    }
}
