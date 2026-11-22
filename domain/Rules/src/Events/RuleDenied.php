<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;

/**
 * The owner denied a proposed rule. Raised once the change has committed.
 */
final readonly class RuleDenied implements Event, UserInterfaceUpdater
{
    public function __construct(public string $ruleId) {}
}
