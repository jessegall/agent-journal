<?php

declare(strict_types=1);

namespace App\Contracts\Work;

/**
 * Where a domain adds its current reminders when an agent's context starts again, inside the hook call; a required
 * reminder is always given, the others while the context budget lasts.
 */
interface ReminderContribution
{
    public function add(string $reminder, bool $required): void;
}
