<?php

declare(strict_types=1);

namespace Domain\Rules\Events;

use App\Contracts\Navigation\ClientUpdate;

/**
 * A rule stopped holding. Raised once the change has committed.
 */
final readonly class RuleRemoved extends RuleEvent implements ClientUpdate
{
    public function __construct(public string $ruleId) {}
}
