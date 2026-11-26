<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Navigation\Contracts\ClientUpdate;

/**
 * A rule stopped holding. Raised once the change has committed.
 */
final readonly class RuleRemoved implements ClientUpdate, RuleEvent
{
    public function __construct(public string $ruleId) {}
}
