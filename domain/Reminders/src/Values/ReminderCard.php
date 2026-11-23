<?php

declare(strict_types=1);

namespace Domain\Reminders\Values;

use Carbon\CarbonImmutable;
use Domain\Reminders\Enums\ReminderStatus;

/**
 * One reminder as the window shows it: its title, when it is due and where it stands.
 */
final readonly class ReminderCard
{
    public function __construct(
        public string $id,
        public string $title,
        public CarbonImmutable $dueAt,
        public ReminderStatus $status,
    ) {}
}
