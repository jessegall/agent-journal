<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Navigation\Contracts\ClientUpdate;

/**
 * The owner approved a proposed rule; it holds from now on. Raised once the change has committed.
 */
final readonly class RuleApproved implements ClientUpdate, RuleEvent
{
    public function __construct(public string $ruleId) {}
}
