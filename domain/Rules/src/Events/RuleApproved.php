<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * The owner approved a proposed rule; it holds from now on. Raised once the change has committed.
 */
final readonly class RuleApproved extends RuleEvent implements UserInterfaceUpdater
{
    public function __construct(public string $ruleId) {}
}
