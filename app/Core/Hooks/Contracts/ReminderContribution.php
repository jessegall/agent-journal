<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

/**
 * Where a domain adds its current reminders after a compaction, inside the hook call that handles it.
 */
interface ReminderContribution
{
    public function add(string $reminder): void;
}
