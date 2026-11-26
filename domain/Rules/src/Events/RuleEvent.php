<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Events\Event;

/**
 * A fact about project rules: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface RuleEvent extends Event
{
    public string $ruleId { get; }
}
