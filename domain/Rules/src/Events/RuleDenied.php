<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * The owner denied a proposed rule. Raised once the change has committed.
 */
final readonly class RuleDenied extends RuleEvent implements UserInterfaceUpdater
{
    public function __construct(public string $ruleId) {}
}
