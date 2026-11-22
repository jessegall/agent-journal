<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;

/**
 * A rule stopped holding. Raised once the change has committed.
 */
final readonly class RuleRemoved implements Event, UserInterfaceUpdater
{
    public function __construct(public string $ruleId) {}
}
