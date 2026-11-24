<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Values\AgentText;

/**
 * Where a domain adds its current reminders when an agent's context starts again, inside the hook call; a required
 * reminder is always given, the others while the context budget lasts.
 */
interface ReminderContribution
{
    /**
     * Adds a reminder to the starting context; a required one is always given, any other while the budget lasts.
     */
    public function add(AgentText $reminder, bool $isRequired): void;
}
