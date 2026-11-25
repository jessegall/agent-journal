<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Navigation\ClientUpdate;

/**
 * The owner denied a proposed rule. Raised once the change has committed.
 */
final readonly class RuleDenied implements ClientUpdate, RuleEvent
{
    public function __construct(public string $ruleId) {}
}
