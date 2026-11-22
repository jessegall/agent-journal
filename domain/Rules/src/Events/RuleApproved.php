<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Events\Event;
use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * The owner approved a proposed rule; it holds from now on. Raised once the change has committed.
 */
final readonly class RuleApproved implements Event, UserInterfaceUpdater
{
    public function __construct(public string $ruleId) {}
}
