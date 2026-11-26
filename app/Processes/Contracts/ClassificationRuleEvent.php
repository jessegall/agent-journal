<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a command classification rule: every event of it implements this, so a listener typed on it receives them all.
 */
interface ClassificationRuleEvent extends Event
{
    public string $ruleId { get; }
}
