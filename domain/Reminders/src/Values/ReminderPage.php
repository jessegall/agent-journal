<?php

declare(strict_types=1);

namespace Domain\Reminders\Values;

/**
 * One page of the calling actor's reminders, open ones first by due time, with how many there are in all.
 */
final readonly class ReminderPage
{
    /**
     * @param  list<ReminderCard>  $cards
     */
    public function __construct(
        public array $cards,
        public int $page,
        public int $perPage,
        public int $total,
    ) {}

    public function lastPage(): int
    {
        return max(1, (int) ceil($this->total / $this->perPage));
    }
}
