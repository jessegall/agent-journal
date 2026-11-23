<?php

declare(strict_types=1);

namespace Domain\Sequences\Values;

use App\Support\NumberedPage;
use Domain\Sequences\Models\SequenceRun;

/**
 * One numbered page of an actor's runs, newest first, with how many runs the actor has in all.
 */
final readonly class SequenceRunPage
{
    /**
     * @param  list<SequenceRun>  $runs
     */
    public function __construct(
        public array $runs,
        public NumberedPage $page,
        public int $total,
    ) {}

    public function lastPage(): int
    {
        return max(1, (int) ceil($this->total / $this->page->size));
    }
}
