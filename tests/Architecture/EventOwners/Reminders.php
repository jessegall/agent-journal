<?php

declare(strict_types=1);

use Domain\Reminders\Events\ReminderFinished;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Reminders with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    ReminderFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Reminder::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReminderFinished('reminder'),
    ],
];
