<?php

declare(strict_types=1);

namespace Domain\Rules\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A rule stopped holding. Raised once the change has committed.
 */
final readonly class RuleRemoved implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(public string $ruleId) {}
}
