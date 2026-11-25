<?php

declare(strict_types=1);

namespace App\Support;

use Carbon\CarbonImmutable;

/**
 * What the owner of a helper knows about its work, handed to Agents as flat facts: whether it has work still open,
 * whether it did this purpose before, and when its last matching and last job of any purpose finished.
 */
final readonly class StartCandidateFacts
{
    public function __construct(
        public ActorReference $actor,
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
        if ($this->hasDoneThisPurpose) {
            return $this->lastMatchingFinish;
        }

        return $this->lastFinish;
    }

    /**
     * The ranking finish as a number that sorts the latest first, with no finish after every finish.
     */
    public function rankingOrder(): int
    {
        $finish = $this->rankingFinish();

        if ($finish === null) {
            return -(PHP_INT_MIN + 1);
        }

        return -$finish->getTimestampMs();
    }
}
